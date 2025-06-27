#!/usr/bin/env python3
"""
Script to upgrade a user to premium status
Usage: python upgrade_user_premium.py <username>
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.database import db
from src.models.user import User
from src.main import app

def upgrade_user_to_premium(username):
    """Upgrade a user to premium status"""
    with app.app_context():
        try:
            # Find user by username
            user = User.query.filter_by(username=username).first()
            
            if not user:
                print(f"❌ User '{username}' not found")
                return False
            
            # Check current status
            if user.is_premium:
                print(f"✅ User '{username}' is already premium")
                return True
            
            # Upgrade to premium
            user.is_premium = True
            db.session.commit()
            
            print(f"🎉 Successfully upgraded user '{username}' to premium!")
            print(f"📧 Email: {user.email}")
            print(f"👤 Name: {user.name}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error upgrading user: {e}")
            db.session.rollback()
            return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python upgrade_user_premium.py <username>")
        print("Example: python upgrade_user_premium.py arsenA")
        sys.exit(1)
    
    username = sys.argv[1]
    success = upgrade_user_to_premium(username)
    sys.exit(0 if success else 1) 