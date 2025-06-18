// Background service worker for Prompto extension

const API_BASE_URL = 'http://localhost:8002';

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 Prompto extension installed');
  
  // Initialize storage
  chrome.storage.local.set({
    analytics: {
      totalEnhancements: 0,
      totalOptimizations: 0,
      tokensSaved: 0,
      timesSaved: 0,
      sessionsCount: 0,
      lastUsed: null
    },
    settings: {
      apiKey: '',
      autoSuggest: true,
      showStats: true,
      apiEndpoint: API_BASE_URL
    },
    userToken: null,
    userData: null
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'ENHANCE_PROMPT':
      handleEnhancePrompt(message.data, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'OPTIMIZE_PROMPT':
      handleOptimizePrompt(message.data, sendResponse);
      return true;
      
    case 'TRACK_TYPING':
      handleTrackTyping(message.data);
      break;
      
    case 'TRACK_SUGGESTION_ACCEPTED':
      handleTrackAcceptance(message.data);
      break;
      
    case 'GET_ANALYTICS':
      handleGetAnalytics(sendResponse);
      return true;
      
    case 'GET_USER_DATA':
      handleGetUserData(sendResponse);
      return true;
      
    case 'LOGIN':
      handleLogin(message.data, sendResponse);
      return true;
      
    case 'LOGOUT':
      handleLogout(sendResponse);
      return true;
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

// Enhance prompt with AI
async function handleEnhancePrompt(data, sendResponse) {
  try {
    const { prompt } = data;
    
    // Get user token
    const storage = await chrome.storage.local.get(['userToken', 'settings']);
    const token = storage.userToken;
    
    if (!token) {
      sendResponse({ 
        success: false, 
        error: 'Please login to use enhancement features' 
      });
      return;
    }

    // Call backend API
    const response = await fetch(`${API_BASE_URL}/api/enhance-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update analytics
    await updateAnalytics('enhancement', {
      originalLength: prompt.length,
      enhancedLength: result.enhanced?.length || 0,
      timestamp: Date.now()
    });

    sendResponse({ 
      success: true, 
      data: { enhanced: result.enhanced } 
    });
    
  } catch (error) {
    console.error('Enhancement error:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Enhancement failed' 
    });
  }
}

// Optimize prompt with Evil Twin algorithm
async function handleOptimizePrompt(data, sendResponse) {
  try {
    const { prompt } = data;
    
    const storage = await chrome.storage.local.get(['userToken']);
    const token = storage.userToken;
    
    if (!token) {
      sendResponse({ 
        success: false, 
        error: 'Please login to use optimization features' 
      });
      return;
    }

    // Call backend API for optimization
    const response = await fetch(`${API_BASE_URL}/api/optimize-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update analytics
    await updateAnalytics('optimization', {
      originalLength: prompt.length,
      optimizedLength: result.optimized?.length || 0,
      tokensSaved: Math.max(0, prompt.length - (result.optimized?.length || 0)),
      timestamp: Date.now()
    });

    sendResponse({ 
      success: true, 
      data: { optimized: result.optimized } 
    });
    
  } catch (error) {
    console.error('Optimization error:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Optimization failed' 
    });
  }
}

// Track typing analytics
async function handleTrackTyping(data) {
  try {
    const storage = await chrome.storage.local.get(['analytics']);
    const analytics = storage.analytics || {};
    
    // Update typing stats
    analytics.lastActivity = data.timestamp;
    analytics.platform = data.platform;
    
    await chrome.storage.local.set({ analytics });
  } catch (error) {
    console.error('Tracking error:', error);
  }
}

// Track suggestion acceptance
async function handleTrackAcceptance(data) {
  try {
    await updateAnalytics('acceptance', data);
    
    // Send to backend for server-side analytics
    const storage = await chrome.storage.local.get(['userToken']);
    const token = storage.userToken;
    
    if (token) {
      fetch(`${API_BASE_URL}/api/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: data.type,
          originalLength: data.originalLength,
          newLength: data.newLength,
          platform: data.platform,
          timestamp: data.timestamp
        })
      }).catch(error => console.error('Analytics sync error:', error));
    }
  } catch (error) {
    console.error('Acceptance tracking error:', error);
  }
}

// Update local analytics
async function updateAnalytics(type, data) {
  try {
    const storage = await chrome.storage.local.get(['analytics']);
    const analytics = storage.analytics || {
      totalEnhancements: 0,
      totalOptimizations: 0,
      tokensSaved: 0,
      timesSaved: 0,
      sessionsCount: 0
    };
    
    switch (type) {
      case 'enhancement':
        analytics.totalEnhancements++;
        analytics.timesSaved += 30; // Assume 30 seconds saved per enhancement
        break;
        
      case 'optimization':
        analytics.totalOptimizations++;
        analytics.tokensSaved += data.tokensSaved || 0;
        analytics.timesSaved += 15; // Assume 15 seconds saved per optimization
        break;
        
      case 'acceptance':
        // Track acceptance rates
        analytics.lastAcceptance = data.timestamp;
        break;
    }
    
    analytics.lastUsed = Date.now();
    
    await chrome.storage.local.set({ analytics });
  } catch (error) {
    console.error('Analytics update error:', error);
  }
}

// Get analytics data
async function handleGetAnalytics(sendResponse) {
  try {
    const storage = await chrome.storage.local.get(['analytics']);
    sendResponse({ 
      success: true, 
      data: storage.analytics || {} 
    });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error.message 
    });
  }
}

// Get user data
async function handleGetUserData(sendResponse) {
  try {
    const storage = await chrome.storage.local.get(['userData', 'userToken']);
    
    if (!storage.userToken) {
      sendResponse({ 
        success: false, 
        error: 'Not logged in' 
      });
      return;
    }
    
    // Fetch fresh user data from backend
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${storage.userToken}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      await chrome.storage.local.set({ userData });
      sendResponse({ 
        success: true, 
        data: userData 
      });
    } else {
      sendResponse({ 
        success: false, 
        error: 'Failed to fetch user data' 
      });
    }
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error.message 
    });
  }
}

// Handle login
async function handleLogin(data, sendResponse) {
  try {
    const { username, password } = data;
    
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Store token and user data
      await chrome.storage.local.set({
        userToken: result.token,
        userData: result.user
      });
      
      sendResponse({ 
        success: true, 
        data: result 
      });
    } else {
      const error = await response.json();
      sendResponse({ 
        success: false, 
        error: error.error || 'Login failed' 
      });
    }
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error.message 
    });
  }
}

// Handle logout
async function handleLogout(sendResponse) {
  try {
    await chrome.storage.local.remove(['userToken', 'userData']);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: error.message 
    });
  }
}

// Periodic analytics sync
chrome.alarms.create('syncAnalytics', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'syncAnalytics') {
    try {
      const storage = await chrome.storage.local.get(['userToken', 'analytics']);
      
      if (storage.userToken && storage.analytics) {
        await fetch(`${API_BASE_URL}/api/analytics/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storage.userToken}`
          },
          body: JSON.stringify(storage.analytics)
        });
      }
    } catch (error) {
      console.error('Analytics sync error:', error);
    }
  }
});

// Handle tab updates for SPA navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const supportedSites = [
      'chat.openai.com',
      'chatgpt.com', 
      'claude.ai',
      'bard.google.com',
      'gemini.google.com'
    ];
    
    const isSupported = supportedSites.some(site => tab.url.includes(site));
    
    if (isSupported) {
      // Inject content script if needed
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          // Trigger rescan of textareas
          chrome.runtime.sendMessage({ type: 'RESCAN_TEXTAREAS' });
        }
      }).catch(() => {
        // Content script might not be ready yet
      });
    }
  }
});

