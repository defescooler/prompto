#!/usr/bin/env python3
"""
Script to create sample data for testing in DataGrip
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
from src.models.prompt import Prompt

def create_sample_data():
    """Create sample data for testing"""
    app = create_app()
    
    with app.app_context():
        print("🎯 Creating sample data for DataGrip testing...\n")
        
        # Create sample users
        print("👤 Creating sample users...")
        users = []
        
        user1 = User(
            name="John Doe",
            username="johndoe",
            email="john@example.com"
        )
        user1.set_password("password123")
        users.append(user1)
        
        user2 = User(
            name="Jane Smith",
            username="janesmith", 
            email="jane@example.com"
        )
        user2.set_password("password123")
        users.append(user2)
        
        for user in users:
            db.session.add(user)
        db.session.commit()
        print(f"✅ Created {len(users)} users")
        
        # Create sample prompt drafts
        print("\n📝 Creating sample prompt drafts...")
        drafts = [
            PromptDraft(
                title="AI Writing Assistant",
                body="You are a professional writing assistant. Help me write clear, engaging content for my blog posts."
            ),
            PromptDraft(
                title="Code Review Helper",
                body="You are an expert code reviewer. Analyze this code and provide constructive feedback on style, efficiency, and best practices."
            ),
            PromptDraft(
                title="Data Analysis Prompt",
                body="You are a data analyst. Help me analyze this dataset and provide insights about trends, patterns, and recommendations."
            ),
            PromptDraft(
                title="Creative Story Generator",
                body="You are a creative writer. Help me develop an engaging story with interesting characters and plot twists."
            ),
            PromptDraft(
                title="Technical Documentation",
                body="You are a technical writer. Help me create clear, comprehensive documentation for this software project."
            )
        ]
        
        for draft in drafts:
            db.session.add(draft)
        db.session.commit()
        print(f"✅ Created {len(drafts)} prompt drafts")
        
        # Create sample prompts (enhanced)
        print("\n🚀 Creating sample enhanced prompts...")
        prompts = [
            Prompt(
                user_id=user1.id,
                title="Blog Post Introduction",
                body="Write an engaging introduction for a blog post about AI in healthcare",
                original_text="Write an introduction for a blog post about AI in healthcare",
                enhanced_text="Craft a compelling and engaging introduction for a blog post exploring the transformative impact of artificial intelligence in healthcare. Focus on capturing the reader's attention with a thought-provoking opening that highlights both the promise and challenges of AI-driven medical innovations.",
                category="writing",
                is_favorite=True,
                effectiveness_score=0.95,
                usage_count=3
            ),
            Prompt(
                user_id=user1.id,
                title="Python Code Review",
                body="Review this Python function for efficiency and best practices",
                original_text="Review this Python function",
                enhanced_text="Conduct a comprehensive code review of this Python function, analyzing it for efficiency, readability, adherence to PEP 8 standards, error handling, and potential optimizations. Provide specific suggestions for improvement.",
                category="programming",
                is_favorite=False,
                effectiveness_score=0.88,
                usage_count=1
            ),
            Prompt(
                user_id=user2.id,
                title="Marketing Email",
                body="Create a persuasive marketing email for a new product launch",
                original_text="Write a marketing email",
                enhanced_text="Compose a compelling and persuasive marketing email for a new product launch. Focus on creating urgency, highlighting unique value propositions, and including a clear call-to-action that drives conversions.",
                category="marketing",
                is_favorite=True,
                effectiveness_score=0.92,
                usage_count=5
            )
        ]
        
        for prompt in prompts:
            db.session.add(prompt)
        db.session.commit()
        print(f"✅ Created {len(prompts)} enhanced prompts")
        
        # Create sample analytics
        print("\n📊 Creating sample analytics...")
        analytics = [
            Analytics(
                user_id=user1.id,
                prompts_enhanced=15,
                time_saved=450,  # 7.5 minutes
                success_rate=0.94,
                total_usage=25
            ),
            Analytics(
                user_id=user2.id,
                prompts_enhanced=8,
                time_saved=240,  # 4 minutes
                success_rate=0.89,
                total_usage=12
            )
        ]
        
        for analytic in analytics:
            db.session.add(analytic)
        db.session.commit()
        print(f"✅ Created {len(analytics)} analytics records")
        
        # Display summary
        print("\n📋 Sample Data Summary:")
        print(f"   Users: {User.query.count()}")
        print(f"   Prompt Drafts: {PromptDraft.query.count()}")
        print(f"   Enhanced Prompts: {Prompt.query.count()}")
        print(f"   Analytics: {Analytics.query.count()}")
        
        print("\n🎉 Sample data created successfully!")
        print("💡 You can now connect DataGrip to:")
        print(f"   SQLite: /Users/User/Downloads/Web/Prompt Copilot Unified System/backend/app.db")
        print("   PostgreSQL: 164.90.160.227:5432/prompt_copilot_db")

if __name__ == '__main__':
    create_sample_data() 