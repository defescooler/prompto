#!/usr/bin/env python3
"""
Test script to verify API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8002/api"

def test_health():
    """Test health endpoint"""
    print("🏥 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_prompt_drafts():
    """Test prompt draft endpoints"""
    print("📝 Testing PromptDraft endpoints...")
    
    # Create a draft
    print("Creating a new prompt draft...")
    draft_data = {
        "title": "Test Prompt Draft",
        "body": "This is a test prompt draft for testing the API."
    }
    
    response = requests.post(f"{BASE_URL}/prompts", json=draft_data)
    print(f"Create Status: {response.status_code}")
    if response.status_code == 201:
        draft = response.json()['draft']
        draft_id = draft['id']
        print(f"Created draft with ID: {draft_id}")
        print(f"Draft: {json.dumps(draft, indent=2)}")
        
        # Get all drafts
        print("\nGetting all drafts...")
        response = requests.get(f"{BASE_URL}/prompts")
        print(f"Get All Status: {response.status_code}")
        if response.status_code == 200:
            drafts = response.json()['drafts']
            print(f"Found {len(drafts)} drafts")
        
        # Get single draft
        print(f"\nGetting draft {draft_id}...")
        response = requests.get(f"{BASE_URL}/prompts/{draft_id}")
        print(f"Get Single Status: {response.status_code}")
        if response.status_code == 200:
            draft = response.json()['draft']
            print(f"Draft: {json.dumps(draft, indent=2)}")
        
        # Update draft
        print(f"\nUpdating draft {draft_id}...")
        update_data = {
            "title": "Updated Test Prompt Draft",
            "body": "This is an updated test prompt draft."
        }
        response = requests.put(f"{BASE_URL}/prompts/{draft_id}", json=update_data)
        print(f"Update Status: {response.status_code}")
        if response.status_code == 200:
            draft = response.json()['draft']
            print(f"Updated draft: {json.dumps(draft, indent=2)}")
        
        # Delete draft
        print(f"\nDeleting draft {draft_id}...")
        response = requests.delete(f"{BASE_URL}/prompts/{draft_id}")
        print(f"Delete Status: {response.status_code}")
        if response.status_code == 200:
            print("Draft deleted successfully")
    
    print()

def test_user_registration():
    """Test user registration"""
    print("👤 Testing user registration...")
    
    user_data = {
        "name": "Test User",
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/register", json=user_data)
    print(f"Registration Status: {response.status_code}")
    if response.status_code == 201:
        result = response.json()
        print(f"User registered: {json.dumps(result['user'], indent=2)}")
        return result.get('token')
    else:
        print(f"Registration failed: {response.json()}")
        return None

def test_prompt_enhancement():
    """Test prompt enhancement"""
    print("🚀 Testing prompt enhancement...")
    
    enhance_data = {
        "prompt": "Write a simple hello world program",
        "user_id": 1
    }
    
    response = requests.post(f"{BASE_URL}/enhance-prompt", json=enhance_data)
    print(f"Enhancement Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Original: {result['original']}")
        print(f"Enhanced: {result['enhanced']}")
    else:
        print(f"Enhancement failed: {response.json()}")
    print()

if __name__ == '__main__':
    print("🧪 Starting API Tests...\n")
    
    # Test health endpoint
    test_health()
    
    # Test prompt drafts
    test_prompt_drafts()
    
    # Test user registration
    token = test_user_registration()
    
    # Test prompt enhancement
    test_prompt_enhancement()
    
    print("✅ API Tests completed!") 