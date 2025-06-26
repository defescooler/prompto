from flask import Blueprint, jsonify, request
from src.database import db
from src.models.user import User
import json
import jwt
import os
from datetime import datetime, timedelta

user_bp = Blueprint('user', __name__)

# JWT Configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"

def get_current_user():
    """Get current user from JWT token"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            return None
        
        user = User.query.get(user_id)
        return user
    except Exception as e:
        return None

def login_required(f):
    """Decorator to require authentication"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_current_user()
        if current_user is None:
            return jsonify({'error': 'Authentication required'}), 401
        return f(current_user, *args, **kwargs)
    return decorated_function

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users', methods=['POST'])
def create_user():
    
    data = request.json
    user = User(username=data['username'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

@user_bp.route('/api/user/techniques', methods=['POST'])
@login_required
def save_user_techniques(current_user):
    """Save user's prompt engineering technique preferences"""
    try:
        data = request.get_json()
        techniques = data.get('techniques', {})
        
        # Validate techniques against catalog
        valid_techniques = {}
        for technique_key, enabled in techniques.items():
            if technique_key in TECHNIQUE_CATALOG:
                # Check if user has premium access for premium techniques
                if TECHNIQUE_CATALOG[technique_key].get('premium', False) and not current_user.is_premium:
                    continue  # Skip premium techniques for non-premium users
                valid_techniques[technique_key] = bool(enabled)
        
        # Store in user profile (you may want to create a separate table for this)
        current_user.technique_preferences = json.dumps(valid_techniques)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Technique preferences saved successfully',
            'techniques': valid_techniques
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@user_bp.route('/api/user/techniques', methods=['GET'])
@login_required
def get_user_techniques(current_user):
    """Get user's prompt engineering technique preferences"""
    try:
        # Get saved preferences or use defaults
        saved_techniques = {}
        if hasattr(current_user, 'technique_preferences') and current_user.technique_preferences:
            saved_techniques = json.loads(current_user.technique_preferences)
        
        # Apply defaults for unsaved techniques
        user_techniques = {}
        for technique_key, technique in TECHNIQUE_CATALOG.items():
            if technique_key in saved_techniques:
                user_techniques[technique_key] = saved_techniques[technique_key]
            else:
                # Use default value if user has access
                has_access = current_user.is_premium or not technique.get('premium', False)
                user_techniques[technique_key] = technique.get('default', False) if has_access else False
        
        return jsonify({
            'success': True,
            'techniques': user_techniques,
            'is_premium': current_user.is_premium
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Technique catalog - same as frontend but server-side
TECHNIQUE_CATALOG = {
    'zero_shot_cot': {
        'name': 'Zero-Shot Chain-of-Thought',
        'description': 'Add step-by-step reasoning trigger to force the model to externalize reasoning',
        'category': 'reasoning',
        'default': True,
        'premium': False
    },
    'role_prompting': {
        'name': 'Role Prompting', 
        'description': 'Expert persona assignment to prime style and domain vocabulary',
        'category': 'style',
        'default': True,
        'premium': False
    },
    'xml_schema': {
        'name': 'XML/JSON Schema Guardrails',
        'description': 'Structured output formatting with explicit tags',
        'category': 'structure',
        'default': True,
        'premium': False
    },
    'compression': {
        'name': 'Prompt Compression',
        'description': 'Minimize tokens while preserving meaning to reduce costs',
        'category': 'efficiency',
        'default': True,
        'premium': False
    },
    'few_shot_cot': {
        'name': 'Few-Shot CoT',
        'description': 'Include reasoning examples to steer both format and depth of the chain',
        'category': 'reasoning',
        'default': False,
        'premium': True
    },
    # ... add all other techniques as premium: True
}
