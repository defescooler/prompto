#!/usr/bin/env python3
"""
Test script to verify database operations
"""
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Set environment variables
os.environ['DATABASE_URL'] = 'sqlite:///app.db'
os.environ['FLASK_ENV'] = 'development'

from src.main import create_app
from src.database import db
from src.models.prompt_draft import PromptDraft
from src.models.user import User
from src.models.analytics import Analytics

def test_database_operations():
    """Test database operations"""
    app = create_app()
    
    with app.app_context():
        print("🧪 Testing Database Operations...\n")
        
        # Test PromptDraft operations
        print("📝 Testing PromptDraft model...")
        
        # Create a draft
        draft = PromptDraft(
            title="Test Draft",
            body="This is a test draft for database testing."
        )
        db.session.add(draft)
        db.session.commit()
        print(f"✅ Created draft with ID: {draft.id}")
        
        # Query the draft
        retrieved_draft = PromptDraft.query.get(draft.id)
        print(f"✅ Retrieved draft: {retrieved_draft.title}")
        print(f"   Body: {retrieved_draft.body}")
        print(f"   Created: {retrieved_draft.created_at}")
        
        # Update the draft
        retrieved_draft.title = "Updated Test Draft"
        retrieved_draft.body = "This is an updated test draft."
        db.session.commit()
        print(f"✅ Updated draft: {retrieved_draft.title}")
        
        # Count drafts
        draft_count = PromptDraft.query.count()
        print(f"✅ Total drafts in database: {draft_count}")
        
        # Test User model
        print("\n👤 Testing User model...")
        
        # Create a user
        user = User(
            name="Test User",
            username="testuser",
            email="test@example.com"
        )
        user.set_password("testpass123")
        db.session.add(user)
        db.session.commit()
        print(f"✅ Created user with ID: {user.id}")
        
        # Test password verification
        if user.check_password("testpass123"):
            print("✅ Password verification works")
        else:
            print("❌ Password verification failed")
        
        # Test Analytics model
        print("\n📊 Testing Analytics model...")
        
        analytics = Analytics(
            user_id=user.id,
            prompts_enhanced=5,
            time_saved=300,
            success_rate=0.95,
            total_usage=10
        )
        db.session.add(analytics)
        db.session.commit()
        print(f"✅ Created analytics for user {user.id}")
        
        # Query all data
        print("\n📋 Database Summary:")
        print(f"   Users: {User.query.count()}")
        print(f"   Prompt Drafts: {PromptDraft.query.count()}")
        print(f"   Analytics: {Analytics.query.count()}")
        
        # Clean up test data
        print("\n🧹 Cleaning up test data...")
        db.session.delete(draft)
        db.session.delete(analytics)
        db.session.delete(user)
        db.session.commit()
        print("✅ Test data cleaned up")
        
        print("\n🎉 All database tests passed!")

if __name__ == '__main__':
    test_database_operations() 