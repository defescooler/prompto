// Prompto Content Script - Robust for ChatGPT 2024
console.log('🚀 Prompto: Content script loaded on', window.location.hostname);

class PromptoCopilot {
  constructor() {
    this.currentOverlay = null;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    console.log('🚀 Prompto: Initializing...');
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startObserving());
    } else {
      this.startObserving();
    }
    this.isInitialized = true;
  }

  startObserving() {
    // Observe DOM changes for dynamic navigation
    this.observer = new MutationObserver(() => {
      setTimeout(() => this.attachToChatGPTInput(), 500);
    });
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    setTimeout(() => this.attachToChatGPTInput(), 1000);
    setInterval(() => this.attachToChatGPTInput(), 3000);
  }

  attachToChatGPTInput() {
    // Always target the main ChatGPT input
    const input = document.querySelector('div[contenteditable="true"]');
    if (!input) return;
    // Prevent duplicate toolbars
    if (input.parentElement.querySelector('.prompto-toolbar')) return;
    this.attachToolbar(input);
  }

  getElementText(element) {
    return element.value || element.textContent || element.innerText || '';
  }

  setElementText(element, text) {
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      element.value = text;
    } else {
      element.textContent = text;
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.focus();
  }

  attachToolbar(element) {
    console.log('🚀 Prompto: Creating toolbar for element');
    const toolbar = document.createElement('div');
    toolbar.className = 'prompto-toolbar';
    toolbar.style.cssText = `
      position: fixed !important;
      z-index: 10000 !important;
      pointer-events: auto !important;
      display: block !important;
    `;
    
    toolbar.innerHTML = `
      <div class="prompto-main-button" style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0DA30D, #51D071);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(13, 163, 13, 0.3);
        transition: all 0.3s ease;
        border: none;
        font-family: system-ui;
      ">✨</div>
      <div class="prompto-actions" style="
        position: absolute;
        bottom: 50px;
        right: 0;
        display: none;
        flex-direction: column;
        gap: 8px;
      ">
        <button class="prompto-enhance-btn" style="
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          background: white;
          color: #333;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          white-space: nowrap;
          border-left: 3px solid #0DA30D;
          font-family: system-ui;
        ">⚡ Enhance</button>
        <button class="prompto-optimize-btn" style="
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          background: white;
          color: #333;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          white-space: nowrap;
          border-left: 3px solid #f59e0b;
          font-family: system-ui;
        ">💰 Optimize</button>
      </div>
    `;

    this.positionToolbar(toolbar, element);
    
    // Event listeners
    const mainBtn = toolbar.querySelector('.prompto-main-button');
    const actions = toolbar.querySelector('.prompto-actions');
    const enhanceBtn = toolbar.querySelector('.prompto-enhance-btn');
    const optimizeBtn = toolbar.querySelector('.prompto-optimize-btn');

    let isExpanded = false;

    mainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isExpanded = !isExpanded;
      actions.style.display = isExpanded ? 'flex' : 'none';
      console.log('🚀 Prompto: Toolbar expanded:', isExpanded);
    });

    enhanceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('🚀 Prompto: Enhance clicked');
      this.handleEnhance(element);
      actions.style.display = 'none';
      isExpanded = false;
    });

    optimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('🚀 Prompto: Optimize clicked');
      this.handleOptimize(element);
      actions.style.display = 'none';
      isExpanded = false;
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!toolbar.contains(e.target)) {
        actions.style.display = 'none';
        isExpanded = false;
      }
    });

    document.body.appendChild(toolbar);
    console.log('🚀 Prompto: Toolbar attached successfully');
  }

  positionToolbar(toolbar, element) {
    // Position toolbar below the input
    const rect = element.getBoundingClientRect();
    toolbar.style.top = `${rect.bottom + window.scrollY + 8}px`;
    toolbar.style.left = `${rect.left + window.scrollX}px`;
  }

  async handleEnhance(element) {
    const text = this.getElementText(element);
    console.log('🚀 Prompto: Enhancing prompt:', text.substring(0, 50) + '...');
    
    if (text.length < 5) {
      this.showToast('Please type at least 5 characters', 'error');
      return;
    }
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'enhance',
        prompt: text
      });
      
      if (response && response.success) {
        this.showSuggestion(element, text, response.enhanced, 'enhance');
      } else {
        this.showToast('Enhancement failed: ' + (response?.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('🚀 Prompto: Enhancement error:', error);
      this.showToast('Enhancement failed - check if backend is running', 'error');
    }
  }

  async handleOptimize(element) {
    const text = this.getElementText(element);
    console.log('🚀 Prompto: Optimizing prompt:', text.substring(0, 50) + '...');
    
    if (text.length < 5) {
      this.showToast('Please type at least 5 characters', 'error');
      return;
    }
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'optimize',
        prompt: text
      });
      
      if (response && response.success) {
        this.showSuggestion(element, text, response.optimized, 'optimize');
      } else {
        this.showToast('Optimization failed: ' + (response?.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('🚀 Prompto: Optimization error:', error);
      this.showToast('Optimization failed - check if backend is running', 'error');
    }
  }

  showSuggestion(element, original, suggestion, type) {
    // Remove existing overlay
    if (this.currentOverlay) {
      this.currentOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'prompto-overlay';
    overlay.style.cssText = `
      position: fixed !important;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui;
    `;
    
    overlay.innerHTML = `
      <div class="prompto-modal" style="
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      ">
        <div class="prompto-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #0DA30D, #51D071);
          color: white;
        ">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">
            ${type === 'enhance' ? '⚡ Enhanced' : '💰 Optimized'} Prompt
          </h3>
          <button class="prompto-close" style="
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">×</button>
        </div>
        <div class="prompto-content" style="
          padding: 20px;
          max-height: 400px;
          overflow-y: auto;
        ">
          <div class="prompto-section" style="margin-bottom: 20px;">
            <h4 style="
              margin: 0 0 8px 0;
              font-size: 14px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">Original (${original.length} chars)</h4>
            <div class="prompto-text" style="
              padding: 12px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              background: #f8f9fa;
              font-size: 14px;
              line-height: 1.5;
              white-space: pre-wrap;
              word-break: break-word;
            ">${original}</div>
          </div>
          <div class="prompto-section">
            <h4 style="
              margin: 0 0 8px 0;
              font-size: 14px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">Suggested (${suggestion.length} chars)</h4>
            <div class="prompto-text" style="
              padding: 12px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              background: #f8f9fa;
              font-size: 14px;
              line-height: 1.5;
              white-space: pre-wrap;
              word-break: break-word;
            ">${suggestion}</div>
          </div>
        </div>
        <div class="prompto-actions" style="
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #e0e0e0;
        ">
          <button class="prompto-decline" style="
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #f5f5f5;
            color: #666;
          ">Decline</button>
          <button class="prompto-accept" style="
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #0DA30D;
            color: white;
          ">Accept</button>
        </div>
      </div>
    `;

    // Event listeners
    overlay.querySelector('.prompto-close').addEventListener('click', () => {
      overlay.remove();
      this.currentOverlay = null;
    });

    overlay.querySelector('.prompto-decline').addEventListener('click', () => {
      overlay.remove();
      this.currentOverlay = null;
    });

    overlay.querySelector('.prompto-accept').addEventListener('click', () => {
      this.setElementText(element, suggestion);
      overlay.remove();
      this.currentOverlay = null;
      this.showToast('Prompt updated!', 'success');
    });

    document.body.appendChild(overlay);
    this.currentOverlay = overlay;
  }

  showToast(message, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed !important;
      top: 20px;
      right: 20px;
      z-index: 10002 !important;
      padding: 12px 16px;
      border-radius: 6px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      background: ${type === 'success' ? '#0DA30D' : '#dc3545'};
      font-family: system-ui;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }
}

new PromptoCopilot();
