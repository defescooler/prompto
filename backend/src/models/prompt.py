from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Prompt(db.Model):
    __tablename__ = 'prompts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    original_text = db.Column(db.Text, nullable=True)
    enhanced_text = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), default='general')
    is_favorite = db.Column(db.Boolean, default=False)
    effectiveness_score = db.Column(db.Float, default=0.0)
    usage_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='prompts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'body': self.body,
            'original_text': self.original_text,
            'enhanced_text': self.enhanced_text,
            'category': self.category,
            'is_favorite': self.is_favorite,
            'effectiveness_score': self.effectiveness_score,
            'usage_count': self.usage_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

