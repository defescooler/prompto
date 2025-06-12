from datetime import datetime
from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.prompt import Prompt
from src.models.analytics import Analytics
from src.routes.auth import verify_jwt_token

prompt_bp = Blueprint('prompt', __name__)

def get_user_from_token():
    """Helper function to get user from Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    user_id = verify_jwt_token(token)
    
    if not user_id:
        return None
    
    return User.query.get(user_id)

@prompt_bp.route('/prompts', methods=['GET'])
def get_prompts():
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        # Get query parameters
        category = request.args.get('category')
        favorites_only = request.args.get('favorites') == 'true'
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Build query
        query = Prompt.query.filter_by(user_id=user.id)
        
        if category:
            query = query.filter_by(category=category)
        
        if favorites_only:
            query = query.filter_by(is_favorite=True)
        
        # Order by most recent
        query = query.order_by(Prompt.created_at.desc())
        
        # Paginate
        prompts = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'prompts': [prompt.to_dict() for prompt in prompts.items],
            'total': prompts.total,
            'pages': prompts.pages,
            'current_page': page
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts', methods=['POST'])
def create_prompt():
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title') or not data.get('body'):
            return jsonify({'error': 'Title and body are required'}), 400
        
        # Create new prompt
        prompt = Prompt(
            user_id=user.id,
            title=data['title'],
            body=data['body'],
            category=data.get('category', 'general'),
            original_text=data.get('original_text'),
            enhanced_text=data.get('enhanced_text')
        )
        
        db.session.add(prompt)
        db.session.commit()
        
        return jsonify({
            'message': 'Prompt created successfully',
            'prompt': prompt.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>', methods=['GET'])
def get_prompt(prompt_id):
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        prompt = Prompt.query.filter_by(id=prompt_id, user_id=user.id).first()
        if not prompt:
            return jsonify({'error': 'Prompt not found'}), 404
        
        return jsonify({'prompt': prompt.to_dict()})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>', methods=['PUT'])
def update_prompt(prompt_id):
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        prompt = Prompt.query.filter_by(id=prompt_id, user_id=user.id).first()
        if not prompt:
            return jsonify({'error': 'Prompt not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            prompt.title = data['title']
        if 'body' in data:
            prompt.body = data['body']
        if 'category' in data:
            prompt.category = data['category']
        if 'enhanced_text' in data:
            prompt.enhanced_text = data['enhanced_text']
        
        prompt.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Prompt updated successfully',
            'prompt': prompt.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>', methods=['DELETE'])
def delete_prompt(prompt_id):
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        prompt = Prompt.query.filter_by(id=prompt_id, user_id=user.id).first()
        if not prompt:
            return jsonify({'error': 'Prompt not found'}), 404
        
        db.session.delete(prompt)
        db.session.commit()
        
        return jsonify({'message': 'Prompt deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>/favorite', methods=['POST'])
def toggle_favorite(prompt_id):
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        prompt = Prompt.query.filter_by(id=prompt_id, user_id=user.id).first()
        if not prompt:
            return jsonify({'error': 'Prompt not found'}), 404
        
        # Check if user can add more favorites (max 10)
        if not prompt.is_favorite and not user.can_add_favorite():
            return jsonify({'error': 'Maximum 10 favorites allowed'}), 400
        
        # Toggle favorite status
        prompt.is_favorite = not prompt.is_favorite
        prompt.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': f'Prompt {"added to" if prompt.is_favorite else "removed from"} favorites',
            'prompt': prompt.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/prompts/<int:prompt_id>/use', methods=['POST'])
def use_prompt(prompt_id):
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        prompt = Prompt.query.filter_by(id=prompt_id, user_id=user.id).first()
        if not prompt:
            return jsonify({'error': 'Prompt not found'}), 404
        
        # Increment usage count
        prompt.usage_count += 1
        prompt.updated_at = datetime.utcnow()
        
        # Update analytics
        analytics = Analytics.query.filter_by(user_id=user.id).first()
        if analytics:
            analytics.total_usage += 1
            analytics.last_activity = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Prompt usage recorded',
            'prompt': prompt.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_bp.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        user = get_user_from_token()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        analytics = Analytics.query.filter_by(user_id=user.id).first()
        if not analytics:
            # Create analytics record if it doesn't exist
            analytics = Analytics(user_id=user.id)
            db.session.add(analytics)
            db.session.commit()
        
        # Get additional stats
        total_prompts = Prompt.query.filter_by(user_id=user.id).count()
        favorite_prompts = Prompt.query.filter_by(user_id=user.id, is_favorite=True).count()
        
        return jsonify({
            'analytics': analytics.to_dict(),
            'total_prompts': total_prompts,
            'favorite_prompts': favorite_prompts,
            'time_saved_formatted': f"{analytics.time_saved // 60}m {analytics.time_saved % 60}s"
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

