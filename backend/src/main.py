import os
import sys
from datetime import datetime, timedelta
import jwt
import bcrypt
import google.generativeai as genai
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

    # Initialize Gemini AI
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)

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

# Prompt enhancement endpoint
@app.route('/api/prompts/enhance', methods=['POST'])
def enhance_prompt():
    try:
        data = request.get_json()
        original_prompt = data.get('prompt', '')
        method = data.get('method', 'llm')
        
        if not original_prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Get user if authenticated
        user = get_current_user()
        
        # Use Gemini to enhance the prompt
        if os.getenv('GEMINI_API_KEY'):
            model = genai.GenerativeModel('gemini-pro')
            if method == "llm":
                enhancement_instruction = """
                You are an expert prompt engineer. Transform this simple prompt into a highly structured, effective prompt using advanced LLM techniques.

                Apply these techniques:
                1. XML structure for clear organization
                2. Chain-of-thought reasoning framework
                3. Role prompting for context
                4. Specific output formatting instructions
                5. Context and requirements breakdown
                6. Clear task definition

                Format the response with XML tags like <task>, <context>, <requirements>, <output_format>, etc.

                Original prompt: {prompt}

                Return ONLY the enhanced prompt with XML structure, no explanations.
                """
            else:  # algorithm compression
                enhancement_instruction = """
                You are an expert at semantic compression. Compress this prompt to reduce token usage while maintaining the exact same meaning and effectiveness.

                Guidelines:
                1. Remove redundant words and phrases
                2. Use more concise language
                3. Maintain all essential information
                4. Preserve the original intent
                5. Keep it clear and actionable

                Original prompt: {prompt}

                Return ONLY the compressed version, no explanations.
                """
            
            try:
                response = model.generate_content(enhancement_instruction.format(prompt=original_prompt))
                enhanced_prompt = response.text.strip()
                
                # Clean up the response
                if enhanced_prompt.startswith('```'):
                    enhanced_prompt = enhanced_prompt.split('\n', 1)[1]
                if enhanced_prompt.endswith('```'):
                    enhanced_prompt = enhanced_prompt.rsplit('\n', 1)[0]
                
            except Exception as e:
                print(f"Gemini API error: {e}")
                # Fallback enhancement
                if method == "llm":
                    enhanced_prompt = f"""<task>
{original_prompt}
</task>

<context>
Please provide a comprehensive and detailed response.
</context>

<requirements>
- Be thorough and accurate
- Include relevant examples
- Structure the response clearly
</requirements>

<output_format>
Provide a well-organized response with clear sections and examples.
</output_format>"""
                else:
                    enhanced_prompt = original_prompt.replace("Create a", "Create").replace(" for a ", " for ")
        else:
            # Fallback enhancement without API
            if method == "llm":
                enhanced_prompt = f"""<task>
{original_prompt}
</task>

<context>
Please provide a comprehensive and detailed response.
</context>

<requirements>
- Be thorough and accurate
- Include relevant examples
- Structure the response clearly
</requirements>

<output_format>
Provide a well-organized response with clear sections and examples.
</output_format>"""
            else:
                enhanced_prompt = original_prompt.replace("Create a", "Create").replace(" for a ", " for ")
        
        # Save to database only if user is authenticated
        prompt_id = None
        if user:
            prompt_record = Prompt(
                user_id=user.id,
                title=original_prompt[:50] + "..." if len(original_prompt) > 50 else original_prompt,
                body=original_prompt,
                original_text=original_prompt,
                enhanced_text=enhanced_prompt,
                category='general',
                effectiveness_score=85.0  # Default score
            )
            db.session.add(prompt_record)
            
            # Update analytics
            analytics = Analytics.query.filter_by(user_id=user.id).first()
            if not analytics:
                analytics = Analytics(user_id=user.id)
                db.session.add(analytics)
            
            analytics.prompts_enhanced += 1
            analytics.time_saved += 30
            analytics.total_usage += 1
            
            db.session.commit()
            prompt_id = prompt_record.id
        
        return jsonify({
            'enhanced_prompt': enhanced_prompt,
            'prompt_id': prompt_id,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

