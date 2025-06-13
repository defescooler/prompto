from datetime import datetime
from src.database import db

class Analytics(db.Model):
    __tablename__ = 'analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    prompts_enhanced = db.Column(db.Integer, default=0)
    time_saved = db.Column(db.Integer, default=0)  # in seconds
    success_rate = db.Column(db.Float, default=0.0)
    total_usage = db.Column(db.Integer, default=0)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='analytics')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'prompts_enhanced': self.prompts_enhanced,
            'time_saved': self.time_saved,
            'success_rate': self.success_rate,
            'total_usage': self.total_usage,
            'last_activity': self.last_activity.isoformat() if self.last_activity else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

