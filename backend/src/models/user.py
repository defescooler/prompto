from datetime import datetime
from src.database import db
import bcrypt

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_premium = db.Column(db.Boolean, default=False)
    oauth_google_id = db.Column(db.String(255), nullable=True)
    oauth_github_id = db.Column(db.String(255), nullable=True)
    
    def set_password(self, password):
        """Hash and set the password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if the provided password matches the hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def get_favorites_count(self):
        """Get count of favorite prompts (max 10)"""
        try:
            if hasattr(self, 'prompts'):
                return len([p for p in self.prompts if p.is_favorite])
            else:
                print(f"Debug: User {self.id} has no 'prompts' attribute")
                return 0
        except Exception as e:
            print(f"Debug: Error in get_favorites_count for user {self.id}: {e}")
            import traceback
            traceback.print_exc()
            return 0
    
    def can_add_favorite(self):
        """Check if user can add more favorites (max 10)"""
        return self.get_favorites_count() < 10

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        try:
            return {
                'id': self.id,
                'name': self.name,
                'username': self.username,
                'email': self.email,
                'created_at': self.created_at.isoformat() if self.created_at else None,
                'updated_at': self.updated_at.isoformat() if self.updated_at else None,
                'is_premium': self.is_premium,
                'favorites_count': self.get_favorites_count()
            }
        except Exception as e:
            print(f"Debug: Error in User.to_dict(): {e}")
            import traceback
            traceback.print_exc()
            return {
                'id': self.id,
                'name': self.name,
                'username': self.username,
                'email': self.email,
                'error': str(e)
            }

