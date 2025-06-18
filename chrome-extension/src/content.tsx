import React from 'react';
import { createRoot } from 'react-dom/client';
import ToolbarButton from './components/ToolbarButton';
import SuggestionOverlay from './components/SuggestionOverlay';
import './content.css';

interface TextareaInfo {
  element: HTMLTextAreaElement | HTMLElement;
  container: HTMLElement;
  root: any;
}

class PromptoCopilot {
  private textareas: Map<HTMLElement, TextareaInfo> = new Map();
  private observer: MutationObserver;
  private currentSuggestion: any = null;
  private isInitialized = false;

  constructor() {
    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.init();
  }

  private init() {
    if (this.isInitialized) return;
    
    console.log('🚀 Prompto: Initializing on', window.location.hostname);
    
    // Start observing DOM changes
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id']
    });

    // Initial scan
    this.scanForTextareas();
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    this.isInitialized = true;
  }

  private handleMutations(mutations: MutationRecord[]) {
    let shouldRescan = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Check if new node contains textareas
            if (element.tagName === 'TEXTAREA' || 
                element.querySelector('textarea') ||
                element.querySelector('[contenteditable="true"]')) {
              shouldRescan = true;
            }
          }
        });
      }
    });

    if (shouldRescan) {
      setTimeout(() => this.scanForTextareas(), 100);
    }
  }

  private scanForTextareas() {
    // Platform-specific selectors
    const selectors = this.getPlatformSelectors();
    
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!this.textareas.has(element as HTMLElement)) {
            this.attachToTextarea(element as HTMLTextAreaElement | HTMLElement);
          }
        });
      } catch (error) {
        console.warn('Prompto: Invalid selector:', selector);
      }
    });
  }

  private getPlatformSelectors(): string[] {
    const hostname = window.location.hostname;
    
    if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) {
      return [
        'textarea[placeholder*="Message"]',
        'textarea[data-id="root"]',
        '#prompt-textarea',
        'textarea[placeholder*="Send a message"]',
        'div[contenteditable="true"][data-testid*="chat"]'
      ];
    }
    
    if (hostname.includes('claude.ai')) {
      return [
        'div[contenteditable="true"][data-testid*="chat"]',
        'div[contenteditable="true"][role="textbox"]',
        'textarea[placeholder*="Talk to Claude"]',
        'div.ProseMirror'
      ];
    }
    
    if (hostname.includes('bard.google.com') || hostname.includes('gemini.google.com')) {
      return [
        'textarea[aria-label*="Enter a prompt"]',
        'div[contenteditable="true"][aria-label*="Message"]',
        'textarea[placeholder*="Enter a prompt"]',
        'div[data-test-id="input-area"]'
      ];
    }
    
    // Generic fallback
    return [
      'textarea[placeholder*="message" i]',
      'textarea[placeholder*="prompt" i]',
      'div[contenteditable="true"][role="textbox"]',
      'textarea[aria-label*="chat" i]'
    ];
  }

  private attachToTextarea(element: HTMLTextAreaElement | HTMLElement) {
    try {
      // Skip if already attached or element is not visible
      if (this.textareas.has(element) || !this.isElementVisible(element)) {
        return;
      }

      console.log('🎯 Prompto: Attaching to textarea:', element);

      // Create container for our toolbar
      const container = document.createElement('div');
      container.className = 'prompto-toolbar-container';
      container.style.cssText = `
        position: absolute;
        z-index: 10000;
        pointer-events: none;
      `;

      // Position container relative to textarea
      const parent = element.parentElement;
      if (!parent) return;

      // Make parent position relative if it isn't already
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.position === 'static') {
        parent.style.position = 'relative';
      }

      parent.appendChild(container);

      // Create React root and render toolbar
      const root = createRoot(container);
      root.render(
        <ToolbarButton
          targetElement={element}
          onEnhance={this.handleEnhance.bind(this)}
          onOptimize={this.handleOptimize.bind(this)}
        />
      );

      // Store reference
      this.textareas.set(element, { element, container, root });

      // Add input listener for analytics
      element.addEventListener('input', this.handleInput.bind(this, element));
      
    } catch (error) {
      console.error('Prompto: Error attaching to textarea:', error);
    }
  }

  private isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           window.getComputedStyle(element).display !== 'none';
  }

  private handleInput(element: HTMLElement, event: Event) {
    const text = this.getTextContent(element);
    
    // Track typing analytics
    chrome.runtime.sendMessage({
      type: 'TRACK_TYPING',
      data: {
        length: text.length,
        timestamp: Date.now(),
        platform: this.detectPlatform()
      }
    });
  }

  private async handleEnhance(element: HTMLElement) {
    const text = this.getTextContent(element);
    if (!text.trim()) {
      this.showToast('Please enter some text to enhance', 'warning');
      return;
    }

    try {
      // Show loading state
      this.showLoadingState(element);

      // Send to background script for API call
      const response = await chrome.runtime.sendMessage({
        type: 'ENHANCE_PROMPT',
        data: { prompt: text }
      });

      if (response?.success) {
        this.showSuggestion(element, response.data.enhanced, 'enhance');
      } else {
        this.showToast(response?.error || 'Enhancement failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      this.showToast('Enhancement failed. Please try again.', 'error');
    } finally {
      this.hideLoadingState(element);
    }
  }

  private async handleOptimize(element: HTMLElement) {
    const text = this.getTextContent(element);
    if (!text.trim()) {
      this.showToast('Please enter some text to optimize', 'warning');
      return;
    }

    try {
      this.showLoadingState(element);

      const response = await chrome.runtime.sendMessage({
        type: 'OPTIMIZE_PROMPT',
        data: { prompt: text }
      });

      if (response?.success) {
        this.showSuggestion(element, response.data.optimized, 'optimize');
      } else {
        this.showToast(response?.error || 'Optimization failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Optimization error:', error);
      this.showToast('Optimization failed. Please try again.', 'error');
    } finally {
      this.hideLoadingState(element);
    }
  }

  private showSuggestion(element: HTMLElement, suggestion: string, type: 'enhance' | 'optimize') {
    // Remove any existing suggestion
    this.hideSuggestion();

    // Create suggestion overlay
    const overlay = document.createElement('div');
    overlay.className = 'prompto-suggestion-overlay';
    document.body.appendChild(overlay);

    const root = createRoot(overlay);
    root.render(
      <SuggestionOverlay
        original={this.getTextContent(element)}
        suggestion={suggestion}
        type={type}
        onAccept={() => this.acceptSuggestion(element, suggestion)}
        onDecline={() => this.hideSuggestion()}
        onClose={() => this.hideSuggestion()}
      />
    );

    this.currentSuggestion = { overlay, root, element, suggestion, type };
  }

  private acceptSuggestion(element: HTMLElement, suggestion: string) {
    this.setTextContent(element, suggestion);
    
    // Track acceptance
    chrome.runtime.sendMessage({
      type: 'TRACK_SUGGESTION_ACCEPTED',
      data: {
        type: this.currentSuggestion?.type,
        originalLength: this.getTextContent(element).length || 0,
        newLength: suggestion.length,
        timestamp: Date.now(),
        platform: this.detectPlatform()
      }
    });

    this.hideSuggestion();
    this.showToast('Suggestion applied successfully!', 'success');
  }

  private hideSuggestion() {
    if (this.currentSuggestion) {
      this.currentSuggestion.root.unmount();
      this.currentSuggestion.overlay.remove();
      this.currentSuggestion = null;
    }
  }

  private showLoadingState(element: HTMLElement) {
    const info = this.textareas.get(element);
    if (info) {
      info.root.render(
        <ToolbarButton
          targetElement={element}
          onEnhance={this.handleEnhance.bind(this)}
          onOptimize={this.handleOptimize.bind(this)}
          isLoading={true}
        />
      );
    }
  }

  private hideLoadingState(element: HTMLElement) {
    const info = this.textareas.get(element);
    if (info) {
      info.root.render(
        <ToolbarButton
          targetElement={element}
          onEnhance={this.handleEnhance.bind(this)}
          onOptimize={this.handleOptimize.bind(this)}
          isLoading={false}
        />
      );
    }
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const toast = document.createElement('div');
    toast.className = `prompto-toast prompto-toast-${type}`;
    toast.textContent = message;
    
    // Position toast
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10001;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: white;
      background: ${type === 'success' ? '#0DA30D' : type === 'error' ? '#ef4444' : '#f59e0b'};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  private getTextContent(element: HTMLElement): string {
    if (element.tagName === 'TEXTAREA') {
      return (element as HTMLTextAreaElement).value;
    } else if (element.contentEditable === 'true') {
      return element.textContent || '';
    }
    return '';
  }

  private setTextContent(element: HTMLElement, text: string) {
    if (element.tagName === 'TEXTAREA') {
      (element as HTMLTextAreaElement).value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (element.contentEditable === 'true') {
      element.textContent = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Focus the element
    element.focus();
  }

  private detectPlatform(): string {
    const hostname = window.location.hostname;
    if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) return 'chatgpt';
    if (hostname.includes('claude.ai')) return 'claude';
    if (hostname.includes('bard.google.com')) return 'bard';
    if (hostname.includes('gemini.google.com')) return 'gemini';
    return 'unknown';
  }

  private handleMessage(message: any, sender: any, sendResponse: any) {
    switch (message.type) {
      case 'PING':
        sendResponse({ success: true });
        break;
      case 'RESCAN_TEXTAREAS':
        this.scanForTextareas();
        sendResponse({ success: true });
        break;
      default:
        break;
    }
  }

  // Cleanup method
  public destroy() {
    this.observer.disconnect();
    this.textareas.forEach(({ root, container }) => {
      root.unmount();
      container.remove();
    });
    this.textareas.clear();
    this.hideSuggestion();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PromptoCopilot());
} else {
  new PromptoCopilot();
}

// Handle page navigation (for SPAs)
let currentUrl = location.href;
new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    setTimeout(() => new PromptoCopilot(), 1000);
  }
}).observe(document, { subtree: true, childList: true });

