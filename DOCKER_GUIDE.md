# 🐳 Docker Compose Setup Guide

## 🚀 Quick Start

Your project now has full Docker Compose support! This makes development and deployment much easier.

## 📋 What's Included

### Services:
- **PostgreSQL 15** - Database with persistent storage
- **Flask Backend** - Your Python application
- **Redis** - Caching layer (for future use)
- **Nginx** - Reverse proxy (production only)

### Features:
- ✅ **Health Checks** - Automatic monitoring
- ✅ **Data Persistence** - Database survives restarts
- ✅ **Development Mode** - Hot reloading
- ✅ **Production Ready** - Optimized for deployment
- ✅ **Sample Data** - Auto-populated for testing

## 🛠️ Development Commands

### Start Everything (Development)
```bash
# Start all services with sample data
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Database Operations
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U prompt_user -d prompt_copilot_db

# Backup database
docker-compose exec postgres pg_dump -U prompt_user prompt_copilot_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U prompt_user -d prompt_copilot_db < backup.sql
```

### Application Commands
```bash
# Run Flask shell
docker-compose exec backend python

# Run database migrations
docker-compose exec backend flask db upgrade

# Create sample data
docker-compose exec backend python create_sample_data.py

# Test the API
docker-compose exec backend python test_api.py
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:
```bash
# Database
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://prompt_user:your_secure_password@postgres:5432/prompt_copilot_db

# Flask
FLASK_ENV=development
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key

# Production
FLASK_DEBUG=0
```

### Ports
- **Flask App**: `http://localhost:8002`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Nginx**: `http://localhost:80` (production)

## 📊 DataGrip Connection

### Development Database
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `prompt_copilot_db`
- **Username**: `prompt_user`
- **Password**: `prompt_password_2024_dev`

### Production Database
- **Host**: `164.90.160.227`
- **Port**: `5432`
- **Database**: `prompt_copilot_db`
- **Username**: `prompt_user`
- **Password**: `your_secure_password`

## 🚀 Production Deployment

### Deploy to Digital Ocean
```bash
# 1. Copy files to server
scp -r . root@164.90.160.227:/opt/prompt-copilot

# 2. SSH to server
ssh root@164.90.160.227

# 3. Navigate to project
cd /opt/prompt-copilot

# 4. Set environment variables
export POSTGRES_PASSWORD=your_secure_production_password
export SECRET_KEY=your_production_secret_key
export GEMINI_API_KEY=your_gemini_api_key

# 5. Start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 6. Check status
docker-compose ps
```

### Production Commands
```bash
# View production logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart

# Update application
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔍 Monitoring & Debugging

### Health Checks
```bash
# Check service health
docker-compose ps

# View health check logs
docker-compose exec backend curl http://localhost:8002/api/health
```

### Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs postgres

# Follow logs
docker-compose logs -f backend
```

### Debugging
```bash
# Access container shell
docker-compose exec backend bash
docker-compose exec postgres bash

# Check database
docker-compose exec postgres psql -U prompt_user -d prompt_copilot_db -c "\dt"

# Check network
docker network ls
docker network inspect prompt_copilot_prompt_copilot_network
```

## 📁 File Structure

```
├── docker-compose.yml              # Main compose file
├── docker-compose.override.yml     # Development overrides
├── docker-compose.prod.yml         # Production overrides
├── .dockerignore                   # Docker ignore file
├── backend/
│   ├── Dockerfile                  # Backend container
│   ├── init-scripts/               # Database init scripts
│   └── ...
└── DOCKER_GUIDE.md                 # This guide
```

## 🧪 Testing

### Test Database Connection
```bash
# Start services
docker-compose up -d

# Wait for database to be ready
docker-compose exec backend python test_db.py

# Test API
docker-compose exec backend python test_api.py
```

### Test DataGrip Connection
1. Open DataGrip
2. New Data Source → PostgreSQL
3. Host: `localhost`
4. Port: `5432`
5. Database: `prompt_copilot_db`
6. User: `prompt_user`
7. Password: `prompt_password_2024_dev`

## 🔒 Security

### Development
- Uses default passwords (safe for local development)
- Exposes all ports for easy debugging

### Production
- Uses environment variables for secrets
- Restricts port access
- Uses non-root users
- Includes health checks

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8002
   lsof -i :5432
   
   # Stop conflicting services
   sudo service postgresql stop  # If you have local PostgreSQL
   ```

2. **Database Connection Failed**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # Check logs
   docker-compose logs postgres
   
   # Restart database
   docker-compose restart postgres
   ```

3. **Permission Issues**
   ```bash
   # Fix volume permissions
   sudo chown -R $USER:$USER ./backend
   ```

4. **Build Failures**
   ```bash
   # Rebuild without cache
   docker-compose build --no-cache
   
   # Clean up
   docker system prune -a
   ```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v
docker system prune -a

# Start fresh
docker-compose up --build
```

## 🎉 Success!

Your Docker Compose setup provides:
- ✅ **Easy Development** - One command to start everything
- ✅ **Consistent Environment** - Same setup everywhere
- ✅ **Production Ready** - Optimized for deployment
- ✅ **Data Persistence** - Database survives restarts
- ✅ **Health Monitoring** - Automatic health checks
- ✅ **Easy Scaling** - Add more containers as needed

You can now develop locally with PostgreSQL and deploy to Digital Ocean with the same containers! 