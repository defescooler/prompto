# Database Setup Guide

## 🚀 Quick Start

Your Flask application now has full database support with Flask-SQLAlchemy and Flask-Migrate!

### ✅ What's Been Set Up

1. **Flask-SQLAlchemy** - Database ORM
2. **Flask-Migrate** - Database migrations
3. **Centralized Configuration** - `config.py` with environment-driven settings
4. **New Models**:
   - `PromptDraft` - Simple prompt drafts with CRUD operations
   - Updated existing models to use centralized database instance
5. **New API Endpoints** - Full CRUD for PromptDraft
6. **Database Management** - `manage.py` for migrations

## 🗄️ Database Configuration

### Local Development (SQLite)
```bash
# Uses SQLite by default
DATABASE_URL=sqlite:///app.db
```

### Production (PostgreSQL on Digital Ocean)
```bash
# Update your .env file with your Digital Ocean credentials
DATABASE_URL=postgresql://username:password@164.90.160.227:5432/prompt_copilot_db
```

## 📋 API Endpoints

### PromptDraft CRUD Operations

#### Create Draft
```bash
POST /api/prompts
Content-Type: application/json

{
  "title": "My Prompt Draft",
  "body": "This is the content of my prompt draft"
}
```

#### Get All Drafts
```bash
GET /api/prompts
```

#### Get Single Draft
```bash
GET /api/prompts/{id}
```

#### Update Draft
```bash
PUT /api/prompts/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated content"
}
```

#### Delete Draft
```bash
DELETE /api/prompts/{id}
```

## 🛠️ Database Management Commands

### Initialize Database
```bash
# For SQLite (local development)
python init_db.py

# For PostgreSQL (production)
export DATABASE_URL=postgresql://username:password@164.90.160.227:5432/prompt_copilot_db
python init_db.py
```

### Flask-Migrate Commands
```bash
# Set Flask app
export FLASK_APP=src.main

# Initialize migrations (first time only)
flask db init

# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade

# Rollback migration
flask db downgrade
```

### Using manage.py
```bash
# Initialize database
python manage.py init-db

# Reset database
python manage.py reset-db

# Drop database
python manage.py drop-db
```

## 🔧 Setting Up Digital Ocean PostgreSQL

### 1. Create Database on Digital Ocean
```bash
# Connect to your Digital Ocean server
ssh root@164.90.160.227

# Install PostgreSQL if not already installed
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE prompt_copilot_db;
CREATE USER prompt_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE prompt_copilot_db TO prompt_user;
\q
```

### 2. Update Environment Variables
```bash
# In your .env file:
DATABASE_URL=postgresql://prompt_user:your_secure_password@164.90.160.227:5432/prompt_copilot_db
FLASK_ENV=production
SECRET_KEY=your-super-secret-production-key
```

### 3. Install PostgreSQL Client
```bash
# For macOS
brew install postgresql

# For Ubuntu/Debian
sudo apt install postgresql-client

# For CentOS/RHEL
sudo yum install postgresql
```

### 4. Test Connection
```bash
# Test PostgreSQL connection
psql -h 164.90.160.227 -U prompt_user -d prompt_copilot_db
```

## 🧪 Testing

### Test Database Operations
```bash
python test_db.py
```

### Test API Endpoints
```bash
# Start the server
export DATABASE_URL=sqlite:///app.db
python src/main.py

# In another terminal, test the API
python test_api.py
```

## 📊 Database Schema

### Tables Created:
- `users` - User accounts and authentication
- `prompts` - Enhanced prompts with analytics
- `prompt_drafts` - Simple prompt drafts (NEW)
- `analytics` - User usage analytics

### PromptDraft Model:
```python
class PromptDraft(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## 🔒 Security Notes

1. **Environment Variables**: Never commit `.env` files to version control
2. **Database Passwords**: Use strong, unique passwords for production
3. **Connection Security**: Use SSL for production PostgreSQL connections
4. **Firewall**: Configure Digital Ocean firewall to allow only necessary ports

## 🚀 Deployment Checklist

- [ ] Set up PostgreSQL on Digital Ocean
- [ ] Create database and user
- [ ] Update `.env` with production credentials
- [ ] Test database connection
- [ ] Run migrations: `flask db upgrade`
- [ ] Test API endpoints
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Configure production logging

## 📝 Example Usage

### Creating a Prompt Draft via API
```bash
curl -X POST http://localhost:8002/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Assistant Prompt",
    "body": "You are a helpful AI assistant. Please help me with..."
  }'
```

### Getting All Drafts
```bash
curl http://localhost:8002/api/prompts
```

## 🆘 Troubleshooting

### Common Issues:

1. **Connection Refused**: Check if PostgreSQL is running and firewall settings
2. **Authentication Failed**: Verify username/password in DATABASE_URL
3. **Database Not Found**: Ensure database exists and user has permissions
4. **Migration Errors**: Check if migrations are up to date

### Debug Commands:
```bash
# Check database connection
python -c "from src.main import create_app; app = create_app(); print('Database connected!')"

# Check tables
sqlite3 app.db ".tables"  # For SQLite
psql -h 164.90.160.227 -U prompt_user -d prompt_copilot_db -c "\dt"  # For PostgreSQL
```

## 🎉 Success!

Your Flask application now has:
- ✅ Full database support with PostgreSQL/SQLite
- ✅ Database migrations with Flask-Migrate
- ✅ New PromptDraft CRUD API
- ✅ Centralized configuration
- ✅ Production-ready setup

You can now store and retrieve data, and your application is ready for production deployment on Digital Ocean! 