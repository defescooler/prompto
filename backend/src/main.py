import os
import sys
from datetime import datetime, timedelta
import jwt
import bcrypt
import google.generativeai as genai
from openai import OpenAI
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.config import config
from src.database import db, migrate, init_app
from src.models.user import User
from src.models.prompt import Prompt
from src.models.analytics import Analytics
from src.models.prompt_draft import PromptDraft
from src.routes.user import user_bp
from src.routes.prompt import prompt_bp
from src.routes.auth import auth_bp
from src.routes.prompt_draft import prompt_draft_bp

# JWT Configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')
    app.config.from_object(config[config_name])

    # Enable CORS for all routes
    CORS(app, origins="*")

    # Initialize database and migrations
    init_app(app)

    # Initialize AI services
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    AI_PROVIDER = os.getenv('AI_PROVIDER', 'auto')
    
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    
    openai_client = None
    if OPENAI_API_KEY:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app

# Create the app instance
app = create_app()

# Helper function to create access token
def create_access_token(data, expires_delta=None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Helper function to get current user from token
def get_current_user():
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
        print(f"Debug: get_current_user found user: {user.id if user else None}")
        return user
    except Exception as e:
        print(f"Debug: Error in get_current_user: {e}")
        import traceback
        traceback.print_exc()
        return None

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([name, username, email, password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            return jsonify({'error': 'Username or email already registered'}), 400
        
        # Create user
        user = User(
            name=name,
            username=username,
            email=email
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Create token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"user_id": user.id}, expires_delta=access_token_expires
        )
        
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username_or_email = data.get('username_or_email')
        password = data.get('password')
        
        if not all([username_or_email, password]):
            return jsonify({'error': 'Username/email and password are required'}), 400
        
        # Find user by username or email
        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"user_id": user.id}, expires_delta=access_token_expires
        )
        
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
def get_current_user_info():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Invalid token'}), 401
    
    return jsonify({
        'user': user.to_dict()
    })

def enhance_with_openai(original_prompt, method='llm'):
    """Enhanced prompt engineering with OpenAI GPT"""
    try:
        openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        if method == "llm":
            system_prompt = """You are the world's leading prompt engineering expert, specializing in optimizing prompts for maximum AI performance. Your expertise lies in transforming simple requests into sophisticated, highly effective prompts that produce exceptional results.

ENHANCEMENT METHODOLOGY:
1. ROLE & EXPERTISE: Define clear expert role for the AI
2. CONTEXT & CONSTRAINTS: Provide relevant background and limitations  
3. TASK STRUCTURE: Break complex requests into clear components
4. OUTPUT SPECIFICATIONS: Define exact format, length, and style requirements
5. QUALITY CONTROLS: Include verification steps and success criteria
6. EXAMPLES: Add relevant examples when beneficial

ADVANCED TECHNIQUES:
- Chain-of-thought reasoning prompts
- Multi-step verification processes  
- Error prevention and edge case handling
- Metacognitive instructions for self-assessment
- Progressive disclosure for complex topics

Transform the user's basic prompt into a sophisticated, structured prompt that will produce 3-5x better results. Maintain the original intent while dramatically improving clarity, specificity, and effectiveness.

Return ONLY the enhanced prompt without any explanations or meta-commentary."""
            
            user_prompt = f"Transform this basic prompt into an expert-level prompt:\n\n{original_prompt}"
            
        else:  # algorithm compression
            system_prompt = """You are an expert at semantic compression and prompt optimization. Your goal is to reduce token usage while maintaining 100% of the original meaning and effectiveness.

COMPRESSION TECHNIQUES:
1. Remove redundant words and phrases
2. Use more precise, concise language
3. Eliminate unnecessary qualifiers
4. Combine related concepts efficiently
5. Maintain all essential information
6. Preserve exact meaning and intent

Return ONLY the compressed version without explanations."""
            
            user_prompt = f"Compress this prompt to minimize tokens while preserving all meaning:\n\n{original_prompt}"
        
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return None

def enhance_with_gemini(original_prompt, method='llm'):
    """Enhanced prompt engineering with Google Gemini"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        if method == "llm":
            enhancement_instruction = """You are an elite prompt engineering specialist with deep expertise in AI optimization. Transform this basic prompt into a sophisticated, highly effective prompt that will produce exceptional results.

ENHANCEMENT FRAMEWORK:
🎯 ROLE DEFINITION: Assign specific expertise role to the AI
🌍 CONTEXT SETTING: Provide relevant background and scenario
📋 TASK BREAKDOWN: Structure complex requests clearly
📐 OUTPUT SPECIFICATIONS: Define format, length, style, tone
🔍 QUALITY ASSURANCE: Include verification and success criteria
💡 EXAMPLES: Add relevant examples when beneficial
🧠 REASONING: Include chain-of-thought instructions

ADVANCED TECHNIQUES:
- Metacognitive prompting for self-reflection
- Progressive disclosure for complex topics
- Error prevention and edge case handling
- Multi-perspective analysis when relevant
- Structured XML tags for clarity

Transform the input into a prompt that's 3-5x more effective while maintaining the original intent. Make it comprehensive, specific, and actionable.

INPUT PROMPT: {prompt}

Return ONLY the enhanced prompt:"""
            
        else:  # compression
            enhancement_instruction = """You are a semantic compression expert. Reduce token usage while preserving 100% of the meaning and effectiveness.

COMPRESSION STRATEGIES:
• Remove redundant words and unnecessary qualifiers
• Use precise, concise language
• Combine related concepts efficiently  
• Eliminate filler words and phrases
• Maintain all essential information and intent

INPUT: {prompt}

Return ONLY the compressed version:"""
        
        response = model.generate_content(enhancement_instruction.format(prompt=original_prompt))
        enhanced = response.text.strip()
        
        # Clean up formatting
        if enhanced.startswith('```'):
            enhanced = enhanced.split('\n', 1)[1] if '\n' in enhanced else enhanced[3:]
        if enhanced.endswith('```'):
            enhanced = enhanced.rsplit('\n', 1)[0] if '\n' in enhanced else enhanced[:-3]
            
        return enhanced
        
    except Exception as e:
        print(f"Gemini API error: {e}")
        return None

def get_fallback_enhancement(original_prompt, method='llm'):
    """Fallback enhancement when AI services are unavailable"""
    if method == "llm":
        return f"""<role>You are an expert assistant with deep knowledge in the relevant field.</role>

<task>
{original_prompt}
</task>

<context>
Please provide a comprehensive, well-structured response that demonstrates expertise and attention to detail.
</context>

<requirements>
- Be thorough and accurate in your analysis
- Include specific examples and evidence where relevant
- Structure your response with clear headings and logical flow
- Provide actionable insights and recommendations
- Consider multiple perspectives when applicable
</requirements>

<output_format>
Deliver a professional, well-organized response with:
1. Clear introduction stating your approach
2. Main content with detailed analysis
3. Specific examples and supporting evidence
4. Summary with key takeaways and next steps
</output_format>

<quality_check>
Before responding, verify that your answer is comprehensive, accurate, and directly addresses all aspects of the request.
</quality_check>"""
    else:
        # Simple compression fallback
        compressed = original_prompt
        replacements = [
            ("Create a detailed", "Create detailed"),
            ("Please provide me with", "Provide"),
            ("I would like you to", ""),
            ("Can you help me", "Help me"),
            ("I need assistance with", "Assist with"),
            (" in order to", " to"),
            (" as well as", " and"),
            ("make sure that", "ensure"),
            ("it is important that", ""),
        ]
        
        for old, new in replacements:
            compressed = compressed.replace(old, new)
        
        return compressed.strip()

# Prompt enhancement endpoint
@app.route('/api/prompts/enhance', methods=['POST'])
def enhance_prompt():
    try:
        data = request.get_json()
        original_prompt = data.get('prompt', '').strip()
        method = data.get('method', 'llm')
        ai_provider = data.get('provider', os.getenv('AI_PROVIDER', 'auto'))
        
        if not original_prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if len(original_prompt) > 5000:
            return jsonify({'error': 'Prompt too long (max 5000 characters)'}), 400
        
        # Get user if authenticated
        user = get_current_user()
        
        enhanced_prompt = None
        provider_used = None
        
        # Try AI enhancement based on provider preference
        if ai_provider == 'openai' or ai_provider == 'auto':
            if os.getenv('OPENAI_API_KEY'):
                enhanced_prompt = enhance_with_openai(original_prompt, method)
                if enhanced_prompt:
                    provider_used = 'openai'
        
        if not enhanced_prompt and (ai_provider == 'gemini' or ai_provider == 'auto'):
            if os.getenv('GEMINI_API_KEY'):
                enhanced_prompt = enhance_with_gemini(original_prompt, method)
                if enhanced_prompt:
                    provider_used = 'gemini'
        
        # Fallback if no AI service worked
        if not enhanced_prompt:
            enhanced_prompt = get_fallback_enhancement(original_prompt, method)
            provider_used = 'fallback'
        
        # Calculate effectiveness score based on enhancement quality
        enhancement_ratio = len(enhanced_prompt) / len(original_prompt) if original_prompt else 1
        base_score = 85.0
        
        if method == 'llm':
            # Reward comprehensive enhancements
            effectiveness_score = min(95.0, base_score + (enhancement_ratio - 1) * 10)
        else:
            # Reward compression
            effectiveness_score = min(95.0, base_score + (2 - enhancement_ratio) * 15)
        
        effectiveness_score = max(70.0, effectiveness_score)  # Minimum score
        
        # Save to database only if user is authenticated
        prompt_id = None
        if user:
            # Generate smart title from original prompt
            title_words = original_prompt.split()[:8]
            title = ' '.join(title_words)
            if len(title_words) == 8:
                title += "..."
            
            prompt_record = Prompt(
                user_id=user.id,
                title=title,
                body=original_prompt,
                original_text=original_prompt,
                enhanced_text=enhanced_prompt,
                category='general',
                effectiveness_score=round(effectiveness_score, 1)
            )
            db.session.add(prompt_record)
            
            # Update analytics
            analytics = Analytics.query.filter_by(user_id=user.id).first()
            if not analytics:
                analytics = Analytics(user_id=user.id)
                db.session.add(analytics)
            
            analytics.prompts_enhanced += 1
            analytics.time_saved += 45  # Increased time saved estimate
            analytics.total_usage += 1
            
            db.session.commit()
            prompt_id = prompt_record.id
        
        return jsonify({
            'enhanced_prompt': enhanced_prompt,
            'prompt_id': prompt_id,
            'success': True,
            'provider_used': provider_used,
            'method': method,
            'effectiveness_score': round(effectiveness_score, 1),
            'enhancement_ratio': round(enhancement_ratio, 2),
            'original_length': len(original_prompt),
            'enhanced_length': len(enhanced_prompt)
        })
        
    except Exception as e:
        print(f"Enhancement error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Enhancement service temporarily unavailable'}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '2.0.0'
    })

# Get user's prompts
@app.route('/api/prompts', methods=['GET'])
def get_prompts():
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        prompts = Prompt.query.filter_by(user_id=user.id).order_by(Prompt.created_at.desc()).all()
        
        return jsonify([
            {
                'id': prompt.id,
                'original_prompt': prompt.original_text,
                'enhanced_prompt': prompt.enhanced_text,
                'effectiveness_score': prompt.effectiveness_score,
                'is_favorite': prompt.is_favorite,
                'created_at': prompt.created_at.isoformat() if prompt.created_at else None
            }
            for prompt in prompts
        ])
        
    except Exception as e:
        print(f"Error fetching prompts: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Get analytics
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        
        analytics = Analytics.query.filter_by(user_id=user.id).first()
        
        if not analytics:
            return jsonify({
                'total_prompts': 0,
                'today_enhancements': 0,
                'average_score': 0.0,
                'favorites_count': 0
            })
        
        # Get today's enhancements
        today = datetime.utcnow().date()
        today_prompts = Prompt.query.filter(
            Prompt.user_id == user.id,
            Prompt.created_at >= today
        ).count()
        
        # Get favorites count
        favorites_count = Prompt.query.filter_by(
            user_id=user.id,
            is_favorite=True
        ).count()
        
        # Get average score
        avg_score = db.session.query(db.func.avg(Prompt.effectiveness_score)).filter_by(user_id=user.id).scalar() or 0.0
        
        return jsonify({
            'total_prompts': analytics.prompts_enhanced,
            'today_enhancements': today_prompts,
            'average_score': round(float(avg_score), 1),
            'favorites_count': favorites_count
        })
        
    except Exception as e:
        print(f"Error fetching analytics: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Root route - API only
@app.route('/')
def root():
    return jsonify({
        'message': 'Prompt Copilot API',
        'status': 'running',
        'frontend': 'http://localhost:5173',
        'docs': 'API endpoints available at /api/*'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8002, debug=True)

