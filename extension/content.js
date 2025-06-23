console.log('🚀 Prompto: Content script loaded');

(() => {
  if (window.__PROMPTO_LOADED) return;
  window.__PROMPTO_LOADED = true;

  const CLASSES = {
    wrapper: 'prompto-wrapper',
    fab: 'prompto-fab',
    child: 'prompto-child',
    toast: 'prompto-toast',
    btn: 'prompto-btn'
  };

  const ICONS = {
    plus: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="12" fill="url(#prompto-grad)"/><svg x="4" y="4" width="16" height="16" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"><path d="M275 0H325V150H275V0ZM275 450H325V600H275V450ZM0 325V275H150V325H0ZM450 325V275H600V325H450ZM70.2 105.5L105.55 70.2L211.6 176.25L176.25 211.6L70.2 105.55V105.5ZM388.4 423.75L423.75 388.4L529.8 494.45L494.45 529.8L388.4 423.75ZM105.85 529.5L70.5 494.15L176.25 388.4L211.6 423.75L105.85 529.5ZM423.75 211.6L388.4 176.25L494.45 70.2L529.8 105.55L423.75 211.6Z" fill="white"/></svg></svg>',
    minus: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="12" fill="url(#prompto-grad)"/><svg x="4" y="4" width="16" height="16" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"><rect x="150" y="275" width="300" height="50" fill="white"/></svg></svg>',
    sparkles: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 2l1.09 3.41a1 1 0 00.95.69h3.58l-2.9 2.11a1 1 0 00-.36 1.12l1.09 3.41-2.9-2.11a1 1 0 00-1.18 0l-2.9 2.11 1.09-3.41a1 1 0 00-.36-1.12L4.38 6.1h3.58a1 1 0 00.95-.69L10 2z" fill="#fff"/></svg>',
    zap: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 2 4 12h5v6l6-10h-5V2z" fill="#fff"/></svg>',
    spinner: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="32" stroke-dashoffset="16"><animate attributeName="stroke-dashoffset" values="16;0;-16" dur="1s" repeatCount="indefinite"/></circle></svg>'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function injectStyles() {
    if ($(`#prompto-styles`)) return;

    const style = document.createElement('style');
    style.id = 'prompto-styles';
    style.textContent = `
      .${CLASSES.btn} { all: unset; box-sizing: border-box; }
      
      .${CLASSES.wrapper} { 
        position: relative; 
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 4px; 
        z-index: 999999999 !important;
        isolation: isolate;
        transform: translateZ(0);
      }

      .${CLASSES.fab} {
        position: relative;
        width: 36px; height: 36px; border-radius: 18px; cursor: pointer;
        background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
        color: #fff; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 12px rgba(13,163,13,0.14);
        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 999999999 !important;
        isolation: isolate;
        transform: translateZ(0);
      }
      .${CLASSES.fab}:hover { 
        box-shadow: 0 4px 16px rgba(13,163,13,0.2); 
        transform: translateZ(0) scale(1.05);
      }
      .${CLASSES.child} {
        position: fixed; 
        width: 32px; height: 32px; border-radius: 16px;
        background: #333; color: #fff; display: flex;
        align-items: center; justify-content: center; cursor: pointer;
        transform: scale(0.3) translateZ(0);
        transform-origin: center; opacity: 0;
        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.15s ease-out;
        pointer-events: none;
        z-index: 999999999 !important;
        isolation: isolate;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .${CLASSES.child}:hover { 
        background: #444; 
        transform: scale(1.1) translateZ(0) !important; 
      }
      .${CLASSES.toast} {
        position: fixed; top: 24px; right: 24px; padding: 12px 16px; border-radius: 8px;
        font-size: 14px; font-weight: 500; color: white; 
        z-index: 999999998 !important;
        transform: translateX(120%) translateZ(0); opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        isolation: isolate;
      }
      .${CLASSES.toast}.visible { transform: translateX(0) translateZ(0); opacity: 1; }
      .${CLASSES.toast}.success { background: #0DA30D; }
      .${CLASSES.toast}.error { background: #dc3545; }
      .${CLASSES.toast}.warn { background: #ffc107; color: #333; }
      .${CLASSES.toast}.info { background: #007bff; }
      
      /* Ensure our elements are always on top of ChatGPT elements */
      .${CLASSES.wrapper}, .${CLASSES.fab}, .${CLASSES.child} {
        position: relative !important;
        z-index: 999999999 !important;
        isolation: isolate !important;
        transform-style: preserve-3d !important;
      }
      
      /* Override any conflicting ChatGPT styles */
      [data-testid*="composer"] .${CLASSES.wrapper},
      [class*="composer"] .${CLASSES.wrapper},
      [class*="textarea"] .${CLASSES.wrapper} {
        z-index: 999999999 !important;
        isolation: isolate !important;
      }
    `;
    document.head.appendChild(style);

    const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDefs.style.position = 'absolute';
    svgDefs.style.width = '0';
    svgDefs.style.height = '0';
    svgDefs.innerHTML = `<defs><linearGradient id="prompto-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0DA3D0"/><stop offset="100%" stop-color="#51D071"/></linearGradient></defs>`;
    document.body.appendChild(svgDefs);
  }

  function findAnchor() {
    // New strategy: Target the containers of the buttons for more stable positioning.

    // 1. Primary target: The container for the speech/voice button on the right.
    // We will insert our button *before* this container.
    const speechButtonContainer = $('[data-testid="composer-speech-button-container"]');
    if (speechButtonContainer) {
      return { element: speechButtonContainer, position: 'before' };
    }
    
    // 2. Fallback: The Russian dictation button.
    // We will insert our button *after* this.
    const dictateButton = $('button[aria-label*="диктовки"], button[aria-label*="Dictation"]');
    if (dictateButton) {
      return { element: dictateButton, position: 'after' };
    }

    // 3. Generic fallback: The main send button.
    const sendButton = $('[data-testid="send-button"]');
    if (sendButton) {
      return { element: sendButton, position: 'before' };
    }

    // 4. Last resort: The old speech button selector, just in case.
    const speechButton = $('[data-testid="composer-speech-button"]');
    if (speechButton) {
      return { element: speechButton, position: 'before' };
    }

    return null;
  }

  function showToast(message, type = 'info') {
    $$(`.${CLASSES.toast}`).forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `${CLASSES.toast} ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  function enhancePrompt(textarea) {
    const text = (textarea?.value || textarea?.textContent || '').trim();
    if (text.length < 5) return showToast('Enter at least 5 characters', 'warn');
    
    chrome.runtime.sendMessage({ action: 'enhancePrompt', prompt: text }, (response) => {
      if (!response?.success) {
        const errorMsg = response?.error || 'Enhancement failed';
        return showToast(errorMsg.includes('Failed to fetch') ? 'Backend not running' : errorMsg, 'error');
      }
      if (textarea.value !== undefined) textarea.value = response.enhanced;
      else textarea.textContent = response.enhanced;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      showToast('✨ Prompt enhanced', 'success');
    });
  }

  function createChild(fab, index, icon, title, callback) {
    const child = document.createElement('button');
    child.className = `${CLASSES.btn} ${CLASSES.child}`;
    child.title = title;
    child.innerHTML = icon;
    child.onclick = (e) => {
      e.stopPropagation();
      callback();
      toggleSpeedDial(fab);
    };
    
    // Get the fab's position relative to the viewport
    const fabRect = fab.getBoundingClientRect();
    const fabCenterX = fabRect.left + fabRect.width / 2;
    const fabTop = fabRect.top;
    
    // Calculate child position - stack them above the textarea area
    const childX = fabCenterX - 16; // Center the 32px button
    const childY = fabTop - (60 + (45 * (index - 1))); // Start 60px above fab, then 45px apart
    
    // Force maximum z-index with inline styles and fixed positioning
    child.style.cssText = `
      position: fixed !important; 
      left: ${childX}px !important;
      top: ${childY}px !important;
      z-index: 999999999 !important; 
      isolation: isolate !important;
      transform-style: preserve-3d !important;
      transform: scale(0.3) translateZ(0) !important;
      opacity: 0 !important;
      pointer-events: none !important;
    `;
    
    // Append to body instead of wrapper to escape any container constraints
    document.body.appendChild(child);
    
    requestAnimationFrame(() => {
      child.style.transform = `scale(1) translateZ(0)`;
      child.style.opacity = '1';
      child.style.pointerEvents = 'auto';
    });
  }

  function openSpeedDial(fab) {
    const textarea = $('textarea, [contenteditable="true"]');
    createChild(fab, 1, ICONS.sparkles, 'Enhance Prompt', () => enhancePrompt(textarea));
    createChild(fab, 2, ICONS.zap, 'Optimize Tokens', () => showToast('Optimizer coming soon', 'info'));

    document.addEventListener('click', function closeOnClickAway(e) {
      // Check if click is on fab or any child button
      const isClickOnFab = fab.contains(e.target);
      const isClickOnChild = e.target.closest(`.${CLASSES.child}`);
      
      if (!isClickOnFab && !isClickOnChild) {
        toggleSpeedDial(fab);
      }
    }, { capture: true, once: true });
  }

  function closeSpeedDial(fab) {
    // Find all child buttons (now attached to body)
    document.querySelectorAll(`.${CLASSES.child}`).forEach(child => {
      child.style.transform = 'scale(0.3) translateZ(0)';
      child.style.opacity = '0';
      child.style.pointerEvents = 'none';
      setTimeout(() => child.remove(), 300);
    });
  }

  function toggleSpeedDial(fab) {
    const isOpen = fab.dataset.open === '1';
    fab.dataset.open = isOpen ? '0' : '1';
    fab.innerHTML = isOpen ? ICONS.plus : ICONS.minus;
    fab.style.transform = isOpen ? 'translateZ(0) rotate(0deg)' : 'translateZ(0) rotate(45deg)';
    if (isOpen) closeSpeedDial(fab);
    else openSpeedDial(fab);
  }

  function mountFAB() {
    if ($(`.${CLASSES.wrapper}`)) return;
    const anchorInfo = findAnchor();
    if (!anchorInfo) return;

    const { element: anchor, position } = anchorInfo;
    const parent = anchor.parentElement;
    if (!parent) return;

    const wrapper = document.createElement('div');
    wrapper.className = CLASSES.wrapper;
    // Force maximum z-index with inline styles
    wrapper.style.cssText = `
      position: relative !important; 
      z-index: 999999999 !important; 
      isolation: isolate !important;
      transform: translateZ(0) !important;
      transform-style: preserve-3d !important;
    `;

    const fab = document.createElement('button');
    fab.className = `${CLASSES.btn} ${CLASSES.fab}`;
    fab.innerHTML = ICONS.plus;
    fab.title = 'Prompto AI Assistant';
    fab.dataset.open = '0';
    fab.onclick = () => toggleSpeedDial(fab);
    // Force maximum z-index with inline styles
    fab.style.cssText = `
      position: relative !important; 
      z-index: 999999999 !important; 
      isolation: isolate !important;
      transform: translateZ(0) !important;
      transform-style: preserve-3d !important;
    `;

    wrapper.appendChild(fab);

    if (position === 'after') {
      parent.insertBefore(wrapper, anchor.nextSibling);
    } else {
      parent.insertBefore(wrapper, anchor);
    }
  }

  function updateChildPositions() {
    const fab = $(`.${CLASSES.fab}`);
    const children = $$(`.${CLASSES.child}`);
    
    if (!fab || children.length === 0) return;
    
    const fabRect = fab.getBoundingClientRect();
    const fabCenterX = fabRect.left + fabRect.width / 2;
    const fabTop = fabRect.top;
    
    children.forEach((child, index) => {
      const childIndex = index + 1; // Start from 1
      const childX = fabCenterX - 16;
      const childY = fabTop - (60 + (45 * (childIndex - 1)));
      
      child.style.left = `${childX}px`;
      child.style.top = `${childY}px`;
    });
  }

  function enforceZIndex() {
    // Periodically ensure our elements stay on top and positions are correct
    const wrapper = $(`.${CLASSES.wrapper}`);
    const fab = $(`.${CLASSES.fab}`);
    const children = $$(`.${CLASSES.child}`);
    
    if (wrapper) {
      wrapper.style.zIndex = '999999999';
      wrapper.style.isolation = 'isolate';
      wrapper.style.transform = wrapper.style.transform || 'translateZ(0)';
    }
    
    if (fab) {
      fab.style.zIndex = '999999999';
      fab.style.isolation = 'isolate';
      if (!fab.style.transform.includes('translateZ')) {
        fab.style.transform = fab.style.transform + ' translateZ(0)';
      }
    }
    
    children.forEach(child => {
      child.style.zIndex = '999999999';
      child.style.isolation = 'isolate';
      if (!child.style.transform.includes('translateZ')) {
        child.style.transform = child.style.transform + ' translateZ(0)';
      }
    });
    
    // Update child positions in case of scrolling/resizing
    updateChildPositions();
  }

  function initialize() {
    injectStyles();
    
    let mountTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(mountTimeout);
        mountTimeout = setTimeout(mountFAB, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            setTimeout(mountFAB, 1000);
        }
    });

    // Periodically enforce z-index to prevent ChatGPT from overriding
    setInterval(enforceZIndex, 2000);

    // Update child positions on scroll and resize
    window.addEventListener('scroll', updateChildPositions, { passive: true });
    window.addEventListener('resize', updateChildPositions, { passive: true });

    setTimeout(mountFAB, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

