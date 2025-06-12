// Popup script for Prompt Copilot Chrome Extension
const API_BASE_URL = 'http://localhost:8002';

let currentUser = null;
let userToken = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserData();
  updateUI();
});

// Load user data from storage
async function loadUserData() {
  try {
    const result = await chrome.storage.local.get(['userToken', 'userData']);
    
    if (result.userToken) {
      userToken = result.userToken;
      
      // Verify token and get fresh user data
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        currentUser = data.user;
        
        // Save updated user data
        await chrome.storage.local.set({ userData: currentUser });
        
        // Load analytics
        await loadAnalytics();
      } else {
        // Token is invalid, clear it
        await chrome.storage.local.remove(['userToken', 'userData']);
        userToken = null;
        currentUser = null;
      }
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Load analytics data
async function loadAnalytics() {
  if (!userToken) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      updateAnalyticsUI(data);
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

// Update UI based on authentication state
function updateUI() {
  const authSection = document.getElementById('auth-section');
  const dashboardSection = document.getElementById('dashboard-section');
  
  if (currentUser) {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    updateUserInfo();
  } else {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
}

// Update user info in UI
function updateUserInfo() {
  if (!currentUser) return;
  
  document.getElementById('user-name').textContent = currentUser.name || currentUser.username;
  document.getElementById('user-email').textContent = currentUser.email;
}

// Update analytics in UI
function updateAnalyticsUI(data) {
  if (!data) return;
  
  document.getElementById('prompts-enhanced').textContent = data.analytics?.prompts_enhanced || 0;
  document.getElementById('time-saved').textContent = data.time_saved_formatted || '0m';
  document.getElementById('favorites-count').textContent = `${data.favorite_prompts || 0}/10`;
  document.getElementById('success-rate').textContent = `${Math.round(data.analytics?.success_rate || 0)}%`;
}

// Show authentication form
function showAuthForm(type) {
  document.getElementById('login-prompt').style.display = 'none';
  document.getElementById('login-form').classList.remove('active');
  document.getElementById('register-form').classList.remove('active');
  
  if (type === 'login') {
    document.getElementById('login-form').classList.add('active');
  } else {
    document.getElementById('register-form').classList.add('active');
  }
}

// Hide authentication form
function hideAuthForm() {
  document.getElementById('login-prompt').style.display = 'block';
  document.getElementById('login-form').classList.remove('active');
  document.getElementById('register-form').classList.remove('active');
  clearErrors();
}

// Clear error messages
function clearErrors() {
  document.getElementById('auth-error').classList.add('hidden');
  document.getElementById('register-error').classList.add('hidden');
}

// Show error message
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

// Handle login
async function handleLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  
  if (!username || !password) {
    showError('auth-error', 'Please fill in all fields');
    return;
  }
  
  clearErrors();
  setLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username_or_email: username,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      userToken = data.token;
      currentUser = data.user;
      
      // Save to storage
      await chrome.storage.local.set({
        userToken: userToken,
        userData: currentUser
      });
      
      // Load analytics and update UI
      await loadAnalytics();
      updateUI();
      
      // Clear form
      document.getElementById('login-username').value = '';
      document.getElementById('login-password').value = '';
    } else {
      showError('auth-error', data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('auth-error', 'Network error. Please try again.');
  } finally {
    setLoading(false);
  }
}

// Handle registration
async function handleRegister() {
  const name = document.getElementById('register-name').value.trim();
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  
  if (!name || !username || !email || !password) {
    showError('register-error', 'Please fill in all fields');
    return;
  }
  
  if (password.length < 8) {
    showError('register-error', 'Password must be at least 8 characters');
    return;
  }
  
  clearErrors();
  setLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        username: username,
        email: email,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      userToken = data.token;
      currentUser = data.user;
      
      // Save to storage
      await chrome.storage.local.set({
        userToken: userToken,
        userData: currentUser
      });
      
      // Load analytics and update UI
      await loadAnalytics();
      updateUI();
      
      // Clear form
      document.getElementById('register-name').value = '';
      document.getElementById('register-username').value = '';
      document.getElementById('register-email').value = '';
      document.getElementById('register-password').value = '';
    } else {
      showError('register-error', data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showError('register-error', 'Network error. Please try again.');
  } finally {
    setLoading(false);
  }
}

// Handle logout
async function handleLogout() {
  await chrome.storage.local.remove(['userToken', 'userData']);
  userToken = null;
  currentUser = null;
  updateUI();
}

// Set loading state
function setLoading(loading) {
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => {
    if (loading) {
      form.classList.add('loading');
    } else {
      form.classList.remove('loading');
    }
  });
}

// Open dashboard
function openDashboard() {
  chrome.tabs.create({ url: 'http://localhost:5175' });
}

// Open prompt library
function openPromptLibrary() {
  chrome.tabs.create({ url: 'http://localhost:5175' });
}

// Toggle setting
async function toggleSetting(setting) {
  const toggle = document.getElementById(`${setting.replace(/([A-Z])/g, '-$1').toLowerCase()}-toggle`);
  const isActive = toggle.classList.contains('active');
  
  if (isActive) {
    toggle.classList.remove('active');
  } else {
    toggle.classList.add('active');
  }
  
  // Save setting to storage
  const settings = await chrome.storage.local.get(['settings']) || { settings: {} };
  settings.settings[setting] = !isActive;
  await chrome.storage.local.set(settings);
}

// Load settings
async function loadSettings() {
  const result = await chrome.storage.local.get(['settings']);
  const settings = result.settings || {};
  
  // Apply settings to UI
  Object.keys(settings).forEach(setting => {
    const toggle = document.getElementById(`${setting.replace(/([A-Z])/g, '-$1').toLowerCase()}-toggle`);
    if (toggle) {
      if (settings[setting]) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    }
  });
}

// Load settings on startup
loadSettings();

