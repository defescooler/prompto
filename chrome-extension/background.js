// Background script for Prompt Copilot Chrome Extension
const API_BASE_URL = 'http://localhost:8002';

// Extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Prompt Copilot extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enhancePrompt') {
    enhancePromptWithAPI(request.prompt, request.userId)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'savePrompt') {
    savePromptToAPI(request.promptData, request.token)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
  
  if (request.action === 'getUserData') {
    getUserFromAPI(request.token)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});

// Enhance prompt using backend API
async function enhancePromptWithAPI(prompt, userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/enhance-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        user_id: userId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        original: data.original,
        enhanced: data.enhanced
      };
    } else {
      throw new Error(data.error || 'Enhancement failed');
    }
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    throw error;
  }
}

// Save prompt to backend API
async function savePromptToAPI(promptData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(promptData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }
}

// Get user data from backend API
async function getUserFromAPI(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.userToken) {
    console.log('User token updated');
  }
});

// Context menu for quick enhancement
chrome.contextMenus.create({
  id: "enhanceSelection",
  title: "Enhance with Prompt Copilot",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "enhanceSelection") {
    chrome.tabs.sendMessage(tab.id, {
      action: "enhanceSelection",
      text: info.selectionText
    });
  }
});

