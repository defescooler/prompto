from datetime import datetime
from flask import Blueprint, request, jsonify
from src.database import db
from src.models.prompt_draft import PromptDraft

prompt_draft_bp = Blueprint('prompt_draft', __name__)

@prompt_draft_bp.route('/prompts', methods=['GET'])
def get_prompt_drafts():
    """Get all prompt drafts"""
    try:
        drafts = PromptDraft.query.order_by(PromptDraft.created_at.desc()).all()
        return jsonify({
            'drafts': [draft.to_dict() for draft in drafts]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prompt_draft_bp.route('/prompts/<int:draft_id>', methods=['GET'])
def get_prompt_draft(draft_id):
    """Get a single prompt draft by ID"""
    try:
        draft = PromptDraft.query.get(draft_id)
        if not draft:
            return jsonify({'error': 'Prompt draft not found'}), 404
        
        return jsonify({'draft': draft.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prompt_draft_bp.route('/prompts', methods=['POST'])
def create_prompt_draft():
    """Create a new prompt draft"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('title') or not data.get('body'):
            return jsonify({'error': 'Title and body are required'}), 400
        
        # Create new draft
        draft = PromptDraft(
            title=data['title'],
            body=data['body']
        )
        
        db.session.add(draft)
        db.session.commit()
        
        return jsonify({
            'message': 'Prompt draft created successfully',
            'draft': draft.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_draft_bp.route('/prompts/<int:draft_id>', methods=['PUT'])
def update_prompt_draft(draft_id):
    """Update a prompt draft"""
    try:
        draft = PromptDraft.query.get(draft_id)
        if not draft:
            return jsonify({'error': 'Prompt draft not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields
        if 'title' in data:
            if not data['title']:
                return jsonify({'error': 'Title cannot be empty'}), 400
            draft.title = data['title']
        
        if 'body' in data:
            if not data['body']:
                return jsonify({'error': 'Body cannot be empty'}), 400
            draft.body = data['body']
        
        draft.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Prompt draft updated successfully',
            'draft': draft.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prompt_draft_bp.route('/prompts/<int:draft_id>', methods=['DELETE'])
def delete_prompt_draft(draft_id):
    """Delete a prompt draft"""
    try:
        draft = PromptDraft.query.get(draft_id)
        if not draft:
            return jsonify({'error': 'Prompt draft not found'}), 404
        
        db.session.delete(draft)
        db.session.commit()
        
        return jsonify({'message': 'Prompt draft deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 