# 🐳 Docker Installation Guide

## 📋 Prerequisites

You need to install Docker Desktop for Mac to use the Docker Compose setup.

## 🚀 Installation Steps

### Option 1: Docker Desktop (Recommended)

1. **Download Docker Desktop**
   - Go to [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Click "Download for Mac"
   - Choose the appropriate version (Apple Silicon or Intel chip)

2. **Install Docker Desktop**
   - Open the downloaded `.dmg` file
   - Drag Docker to Applications folder
   - Open Docker from Applications
   - Follow the setup wizard

3. **Verify Installation**
   ```bash
   docker --version
   docker-compose --version
   ```

### Option 2: Homebrew (Alternative)

```bash
# Install Docker Desktop via Homebrew
brew install --cask docker

# Start Docker Desktop
open /Applications/Docker.app
```

### Option 3: Manual Installation

1. **Download from Docker Hub**
   - Visit [https://hub.docker.com/editions/community/docker-ce-desktop-mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac)
   - Download the appropriate version

2. **Install and Configure**
   - Follow the installation wizard
   - Grant necessary permissions when prompted

## ✅ Verification

After installation, verify everything works:

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Test Docker
docker run hello-world
```

## 🚀 Quick Start with Your Project

Once Docker is installed:

```bash
# Navigate to your project
cd /Users/User/Downloads/Web/Prompt\ Copilot\ Unified\ System

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🔧 Troubleshooting

### Common Issues:

1. **Docker Desktop not starting**
   - Check if you have enough disk space
   - Restart your Mac
   - Reinstall Docker Desktop

2. **Permission denied**
   - Make sure Docker Desktop is running
   - Check if you're in the docker group

3. **Port conflicts**
   ```bash
   # Check what's using port 8002
   lsof -i :8002
   
   # Stop conflicting services
   sudo service postgresql stop  # If you have local PostgreSQL
   ```

## 📊 Next Steps

After Docker is installed:

1. **Start your project**:
   ```bash
   docker-compose up -d
   ```

2. **Connect DataGrip**:
   - Host: `localhost`
   - Port: `5432`
   - Database: `prompt_copilot_db`
   - User: `prompt_user`
   - Password: `prompt_password_2024_dev`

3. **Test the API**:
   ```bash
   curl http://localhost:8002/api/health
   ```

## 🎉 Success!

Once Docker is installed and running, you'll have:
- ✅ **PostgreSQL Database** running in a container
- ✅ **Flask Application** with hot reloading
- ✅ **Redis Cache** for future use
- ✅ **Easy Development** environment
- ✅ **Production Ready** setup

Your development environment will be consistent and easy to manage! 