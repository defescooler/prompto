#!/usr/bin/env python3
"""
Create John Carmack demo user for MVP demonstration
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
from src.models.user import User
from src.models.prompt import Prompt
from src.models.analytics import Analytics

def create_jcarmack_demo():
    """Create John Carmack demo user"""
    app = create_app()
    
    with app.app_context():
        print("🚀 Creating John Carmack demo user for MVP...\n")
        
        # Check if user already exists
        existing_user = User.query.filter(
            (User.username == 'jcarmack') | (User.email == 'john.carmack@idsoftware.com')
        ).first()
        
        if existing_user:
            print("✅ John Carmack user already exists!")
            print(f"   Username: {existing_user.username}")
            print(f"   Email: {existing_user.email}")
            print(f"   Password: carmack2024")
            return
        
        # Create John Carmack user
        jcarmack = User(
            name="John Carmack",
            username="jcarmack",
            email="john.carmack@idsoftware.com"
        )
        jcarmack.set_password("carmack2024")
        
        db.session.add(jcarmack)
        db.session.commit()
        
        print("✅ Created John Carmack demo user:")
        print(f"   Username: jcarmack")
        print(f"   Email: john.carmack@idsoftware.com")
        print(f"   Password: carmack2024")
        
        # Create sample prompts for John Carmack
        sample_prompts = [
            Prompt(
                user_id=jcarmack.id,
                title="Game Engine Optimization",
                body="Analyze this rendering pipeline for performance bottlenecks and suggest optimizations",
                original_text="Look at this code and make it faster",
                enhanced_text="Conduct a comprehensive performance analysis of this rendering pipeline code, identifying specific bottlenecks in GPU utilization, memory bandwidth, and CPU-GPU synchronization. Provide detailed optimization recommendations with quantifiable performance impact estimates.",
                category="programming",
                is_favorite=True,
                effectiveness_score=0.97,
                usage_count=8
            ),
            Prompt(
                user_id=jcarmack.id,
                title="VR Latency Reduction",
                body="Explain techniques for minimizing motion-to-photon latency in VR systems",
                original_text="How to reduce VR lag",
                enhanced_text="Provide a comprehensive technical explanation of motion-to-photon latency reduction techniques in VR systems, covering predictive tracking, asynchronous timewarp, low-persistence displays, and GPU scheduling optimizations. Include specific implementation strategies and performance metrics.",
                category="technical",
                is_favorite=True,
                effectiveness_score=0.95,
                usage_count=12
            ),
            Prompt(
                user_id=jcarmack.id,
                title="Rocket Engine Analysis",
                body="Compare the efficiency of different rocket propulsion systems for Mars missions",
                original_text="Rocket engines for Mars",
                enhanced_text="Conduct a detailed comparative analysis of rocket propulsion systems for Mars missions, evaluating specific impulse, thrust-to-weight ratios, fuel efficiency, and operational complexity. Focus on chemical, nuclear thermal, and ion propulsion systems with quantitative performance metrics.",
                category="aerospace",
                is_favorite=False,
                effectiveness_score=0.92,
                usage_count=3
            )
        ]
        
        for prompt in sample_prompts:
            db.session.add(prompt)
        db.session.commit()
        
        # Create analytics for John Carmack
        analytics = Analytics(
            user_id=jcarmack.id,
            prompts_enhanced=23,
            time_saved=1380,  # 23 minutes
            success_rate=0.96,
            total_usage=45
        )
        
        db.session.add(analytics)
        db.session.commit()
        
        print(f"\n📊 Created sample data:")
        print(f"   Prompts: {len(sample_prompts)}")
        print(f"   Usage: 45 total enhancements")
        print(f"   Success Rate: 96%")
        print(f"   Time Saved: 23 minutes")
        
        print("\n🎉 John Carmack demo account ready for MVP!")

if __name__ == '__main__':
    create_jcarmack_demo() 