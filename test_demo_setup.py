#!/usr/bin/env python3
"""
Demo Setup Testing Script

This script tests all components of the Prompt Copilot system
to ensure everything is working for the MVP demo.
"""

import requests
import time
import json
import sys
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8002"
FRONTEND_URL = "http://localhost:5173"
API_BASE = f"{BACKEND_URL}/api"

def print_status(message, status="INFO"):
    """Print formatted status message"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    emoji = {
        "INFO": "ℹ️",
        "SUCCESS": "✅",
        "ERROR": "❌",
        "WARNING": "⚠️"
    }.get(status, "ℹ️")
    
    print(f"{emoji} [{timestamp}] {message}")

def test_backend_health():
    """Test backend health endpoint"""
    print_status("Testing backend health...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_status(f"Backend healthy - Version: {data.get('version', 'unknown')}", "SUCCESS")
            return True
        else:
            print_status(f"Backend unhealthy - Status: {response.status_code}", "ERROR")
            return False
    except requests.exceptions.RequestException as e:
        print_status(f"Backend connection failed: {e}", "ERROR")
        return False

def test_frontend_availability():
    """Test frontend availability"""
    print_status("Testing frontend availability...")
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print_status("Frontend is accessible", "SUCCESS")
            return True
        else:
            print_status(f"Frontend error - Status: {response.status_code}", "ERROR")
            return False
    except requests.exceptions.RequestException as e:
        print_status(f"Frontend connection failed: {e}", "ERROR")
        return False

def test_user_registration():
    """Test user registration"""
    print_status("Testing user registration...")
    try:
        user_data = {
            "name": "Demo User",
            "username": "demo_user",
            "email": "demo@example.com",
            "password": "demo123"
        }
        
        response = requests.post(f"{API_BASE}/register", json=user_data, timeout=10)
        if response.status_code == 201:
            data = response.json()
            print_status("User registration successful", "SUCCESS")
            return data.get('token')
        elif response.status_code == 400:
            print_status("User already exists, testing login...", "WARNING")
            return test_user_login()
        else:
            print_status(f"Registration failed - Status: {response.status_code}", "ERROR")
            return None
    except requests.exceptions.RequestException as e:
        print_status(f"Registration request failed: {e}", "ERROR")
        return None

def test_user_login():
    """Test user login"""
    print_status("Testing user login...")
    try:
        login_data = {
            "username_or_email": "demo@example.com",
            "password": "demo123"
        }
        
        response = requests.post(f"{API_BASE}/login", json=login_data, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print_status("User login successful", "SUCCESS")
            return data.get('token')
        else:
            print_status(f"Login failed - Status: {response.status_code}", "ERROR")
            return None
    except requests.exceptions.RequestException as e:
        print_status(f"Login request failed: {e}", "ERROR")
        return None

def test_prompt_enhancement(token):
    """Test prompt enhancement API"""
    print_status("Testing prompt enhancement...")
    try:
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        
        enhancement_data = {
            "prompt": "Write a blog post about AI",
            "user_id": 1
        }
        
        response = requests.post(f"{API_BASE}/enhance-prompt", 
                               json=enhancement_data, 
                               headers=headers, 
                               timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            print_status("Prompt enhancement successful", "SUCCESS")
            print_status(f"Original: {data['original'][:50]}...")
            print_status(f"Enhanced: {data['enhanced'][:50]}...")
            return True
        else:
            print_status(f"Enhancement failed - Status: {response.status_code}", "ERROR")
            return False
    except requests.exceptions.RequestException as e:
        print_status(f"Enhancement request failed: {e}", "ERROR")
        return False

def test_prompts_api(token):
    """Test prompts API"""
    print_status("Testing prompts API...")
    try:
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        
        response = requests.get(f"{API_BASE}/prompts", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print_status(f"Prompts API working - Found {len(data)} prompts", "SUCCESS")
            return True
        else:
            print_status(f"Prompts API failed - Status: {response.status_code}", "ERROR")
            return False
    except requests.exceptions.RequestException as e:
        print_status(f"Prompts API request failed: {e}", "ERROR")
        return False

def test_analytics_api(token):
    """Test analytics API"""
    print_status("Testing analytics API...")
    try:
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        
        response = requests.get(f"{API_BASE}/analytics", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print_status("Analytics API working", "SUCCESS")
            return True
        else:
            print_status(f"Analytics API failed - Status: {response.status_code}", "ERROR")
            return False
    except requests.exceptions.RequestException as e:
        print_status(f"Analytics API request failed: {e}", "ERROR")
        return False

def test_chrome_extension_files():
    """Test Chrome extension files"""
    print_status("Testing Chrome extension files...")
    import os
    
    required_files = [
        "chrome-extension/manifest.json",
        "chrome-extension/popup.html",
        "chrome-extension/popup.js",
        "chrome-extension/content.js",
        "chrome-extension/background.js",
        "chrome-extension/styles.css",
        "chrome-extension/icon16.png",
        "chrome-extension/icon48.png",
        "chrome-extension/icon128.png"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print_status(f"Missing Chrome extension files: {missing_files}", "ERROR")
        return False
    else:
        print_status("All Chrome extension files present", "SUCCESS")
        return True

def test_docker_services():
    """Test Docker services"""
    print_status("Testing Docker services...")
    try:
        import subprocess
        result = subprocess.run(["docker-compose", "ps"], 
                              capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print_status("Docker services check successful", "SUCCESS")
            # Parse and show service status
            lines = result.stdout.strip().split('\n')
            for line in lines[1:]:  # Skip header
                if line.strip():
                    print_status(f"  {line.strip()}")
            return True
        else:
            print_status("Docker services check failed", "ERROR")
            return False
    except Exception as e:
        print_status(f"Docker services check failed: {e}", "ERROR")
        return False

def main():
    """Run all tests"""
    print("🚀 Prompt Copilot Demo Setup Testing")
    print("=" * 50)
    
    tests = []
    
    # Test Docker services
    tests.append(("Docker Services", test_docker_services()))
    
    # Test backend
    tests.append(("Backend Health", test_backend_health()))
    
    # Test frontend
    tests.append(("Frontend Availability", test_frontend_availability()))
    
    # Test user authentication
    token = test_user_registration()
    tests.append(("User Authentication", token is not None))
    
    # Test APIs with authentication
    if token:
        tests.append(("Prompt Enhancement", test_prompt_enhancement(token)))
        tests.append(("Prompts API", test_prompts_api(token)))
        tests.append(("Analytics API", test_analytics_api(token)))
    else:
        tests.append(("Prompt Enhancement", False))
        tests.append(("Prompts API", False))
        tests.append(("Analytics API", False))
    
    # Test Chrome extension
    tests.append(("Chrome Extension Files", test_chrome_extension_files()))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary")
    print("=" * 50)
    
    passed = 0
    total = len(tests)
    
    for test_name, result in tests:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print_status("🎉 All tests passed! Demo is ready.", "SUCCESS")
        print("\n📋 Demo Checklist:")
        print("✅ Backend API running")
        print("✅ Frontend webapp running")
        print("✅ Database connected")
        print("✅ User authentication working")
        print("✅ Prompt enhancement working")
        print("✅ Chrome extension ready")
        print("\n🚀 Ready for MVP demo!")
    else:
        print_status("⚠️ Some tests failed. Please check the issues above.", "WARNING")
        print("\n🔧 Troubleshooting:")
        print("1. Check Docker services: docker-compose ps")
        print("2. Check backend logs: docker-compose logs backend")
        print("3. Check frontend: cd frontend && npm run dev")
        print("4. Check Chrome extension files")
        
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 