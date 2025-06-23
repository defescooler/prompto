console.log('🚀 Prompto: Content script loaded');

(() => {
  if (window.__PROMPTO_LOADED) return;
  window.__PROMPTO_LOADED = true;

  const CLASSES = {
    wrapper: 'prompto-wrapper',
    fab: 'prompto-fab',
    child: 'prompto-child',
    toast: 'prompto-toast',
    banner: 'prompto-banner',
    btn: 'prompto-btn'
  };

  const ICONS = {
    plus: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="12" fill="url(#prompto-grad)"/><svg x="4" y="4" width="16" height="16" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"><path d="M275 0H325V150H275V0ZM275 450H325V600H275V450ZM0 325V275H150V325H0ZM450 325V275H600V325H450ZM70.2 105.5L105.55 70.2L211.6 176.25L176.25 211.6L70.2 105.55V105.5ZM388.4 423.75L423.75 388.4L529.8 494.45L494.45 529.8L388.4 423.75ZM105.85 529.5L70.5 494.15L176.25 388.4L211.6 423.75L105.85 529.5ZM423.75 211.6L388.4 176.25L494.45 70.2L529.8 105.55L423.75 211.6Z" fill="white"/></svg></svg>',
    minus: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="12" fill="url(#prompto-grad)"/><svg x="4" y="4" width="16" height="16" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"><rect x="150" y="275" width="300" height="50" fill="white"/></svg></svg>',
    sparkles: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 2l1.09 3.41a1 1 0 00.95.69h3.58l-2.9 2.11a1 1 0 00-.36 1.12l1.09 3.41-2.9-2.11a1 1 0 00-1.18 0l-2.9 2.11 1.09-3.41a1 1 0 00-.36-1.12L4.38 6.1h3.58a1 1 0 00.95-.69L10 2z" fill="#fff"/></svg>',
    zap: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 2 4 12h5v6l6-10h-5V2z" fill="#fff"/></svg>',
    spinner: '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="8" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="32" stroke-dashoffset="16"><animate attributeName="stroke-dashoffset" values="16;0;-16" dur="1s" repeatCount="indefinite"/></circle></svg>',
    construction: '<svg viewBox="0 0 36 36" width="20" height="20"><path fill="#FFCC4D" d="M36 15a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v8z"></path><path d="M6 3H4a4 4 0 0 0-4 4v2l6-6zm6 0L0 15c0 1.36.682 2.558 1.72 3.28L17 3h-5zM7 19h5L28 3h-5zm16 0L35.892 6.108A3.995 3.995 0 0 0 33.64 3.36L18 19h5zm13-4v-3l-7 7h3a4 4 0 0 0 4-4z" fill="#292F33"></path><path fill="#99AAB5" d="M4 19h5v14H4zm23 0h5v14h-5z"></path></svg>'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Returns the textarea or contenteditable element currently holding user input
  function getCurrentPromptElement() {
    const active = document.activeElement;
    if (active && (active.matches('textarea') || active.isContentEditable)) {
      return active;
    }
    const candidates = [...document.querySelectorAll('textarea, [contenteditable="true"]')];
    for (const el of candidates) {
      const value = ('value' in el) ? el.value : el.textContent;
      if (value && value.trim().length > 0) return el;
    }
    return candidates[0] || null;
  }

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
        width: 40px; height: 40px; border-radius: 20px;
        background: #333; color: #fff; display: flex;
        align-items: center; justify-content: center; cursor: pointer;
        transform: scale(0.3) translateZ(0);
        transform-origin: center; opacity: 0;
        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.15s ease-out;
        pointer-events: none;
        z-index: 999999999 !important;
        isolation: isolate;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        position: relative;
      }
      .${CLASSES.child}:hover { 
        background: #444; 
        transform: scale(1.1) translateZ(0) !important; 
      }
      .${CLASSES.child}.enhance {
        background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
      }
      .${CLASSES.child}.enhance:hover {
        background: linear-gradient(135deg, #51D071 0%, #0DA30D 100%);
        transform: scale(1.15) translateZ(0) !important;
      }
      .${CLASSES.child}.construction {
        background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
        cursor: not-allowed;
      }
      .${CLASSES.child}.construction:hover {
        background: linear-gradient(135deg, #FFB347 0%, #FF8C00 100%);
        transform: scale(1.05) translateZ(0) !important;
      }
      
      /* Tooltip labels for buttons */
      .${CLASSES.child}::after {
        content: attr(data-label);
        position: absolute;
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .${CLASSES.child}:hover::after {
        opacity: 1;
      }
      
      .${CLASSES.banner} {
        position: fixed; 
        top: 20px; 
        left: 50%; 
        transform: translateX(-50%) translateY(-100px); 
        background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
        color: white; 
        padding: 16px 24px; 
        border-radius: 12px;
        font-size: 15px; 
        font-weight: 600; 
        z-index: 999999999 !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        isolation: isolate;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .${CLASSES.banner}.visible { transform: translateX(-50%) translateY(0); }
      .${CLASSES.banner}.success { 
        background: linear-gradient(135deg, #0DA30D 0%, #51D071 100%);
        border-color: rgba(81, 208, 113, 0.3);
      }
      .${CLASSES.banner}.error { 
        background: linear-gradient(135deg, #dc3545 0%, #ff4757 100%);
        border-color: rgba(255, 71, 87, 0.3);
      }
      .${CLASSES.banner}.warn { 
        background: linear-gradient(135deg, #ffc107 0%, #ffb700 100%);
        color: #333;
        border-color: rgba(255, 183, 0, 0.3);
      }
      .${CLASSES.banner}.info { 
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        border-color: rgba(0, 123, 255, 0.3);
      }
      .${CLASSES.banner}.construction { 
        background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
        border-color: rgba(255, 165, 0, 0.3);
      }
      .${CLASSES.banner}.review {
        background: rgba(24,24,27,0.90);
        border: 1px solid #3f3f46;
        backdrop-filter: blur(8px);
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

      /* Ensure textarea can scroll when maxed out */
      textarea.prompto-preview {
        resize: none !important;
        overflow-y: hidden; /* toggled to auto when needed */
        line-height: 1.4;
      }

      [contenteditable="true"].prompto-preview {
        resize: none !important;
        overflow-y: hidden;
        line-height: 1.4;
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
    // 0. Try to anchor to microphone / voice input button (preferred)
    const micButton = document.querySelector('button[aria-label*="voice"], button[aria-label*="микрофон"], button[data-testid*="voice"], button[data-testid*="microphone"]');
    if (micButton) {
      const rect = micButton.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && getComputedStyle(micButton).visibility !== 'hidden' && getComputedStyle(micButton).display !== 'none') {
        return { element: micButton, position: 'after' }; // place FAB right of mic
      }
    }

    // 1. Anchor to send button when mic not found
    const textarea = document.querySelector('textarea');
    if (textarea) {
      // Walk up to the <form> element (ChatGPT composer) or its immediate parent
      const composer = textarea.closest('form') || textarea.parentElement;
      if (composer) {
        // Look for the send button inside composer
        const sendBtn = composer.querySelector('button[type="submit"], button[data-testid="send-button"]');
        if (sendBtn) {
          const rect = sendBtn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return { element: sendBtn, position: 'before' };
          }
        }
        // Otherwise use composer itself as anchor (insert at start)
        return { element: composer, position: 'before' };
      }
    }

    // 2. Send-button container fallback
    const sendButtonContainer = document.querySelector('[data-testid="send-button"]')?.parentElement;
    if (sendButtonContainer) {
      const el = sendButtonContainer.children[0] || sendButtonContainer;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return { element: el, position: 'before' };
      }
    }

    // 3. Plain send-button fallback
    const sendButton = document.querySelector('[data-testid="send-button"]');
    if (sendButton) {
      const rectSend = sendButton.getBoundingClientRect();
      if (rectSend.width > 0 && rectSend.height > 0) {
        return { element: sendButton, position: 'before' };
      }
    }

    // 4. Any composer-area button (last one -> rightmost)
    const composerButtons = [...document.querySelectorAll('[data-testid*="composer"] button, [class*="composer"] button')];
    if (composerButtons.length) {
      return { element: composerButtons[composerButtons.length - 1], position: 'after' };
    }

    // 5. Fallback: none found
    return null;
  }

  function showBanner(message, type = 'info', icon = null) {
    $$(`.${CLASSES.banner}`).forEach(b => b.remove());
    const banner = document.createElement('div');
    banner.className = `${CLASSES.banner} ${type}`;
    
    if (icon) {
      banner.innerHTML = `${icon}<span>${message}</span>`;
    } else {
      banner.textContent = message;
    }
    
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('visible'));
    setTimeout(() => {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 400);
    }, 3000);
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

  // Review & Apply overlay for enhanced prompt suggestions
  function showEnhancementOverlay({ textarea, original, enhanced, strategy }) {
    // Remove any existing overlays
    $$(`.${CLASSES.banner}.review`).forEach(o => o.remove());

    const overlay = document.createElement('div');
    overlay.className = `${CLASSES.banner} review`;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'prompto-review-title');
    overlay.style.maxWidth = '580px';
    overlay.style.background = 'rgba(24,24,27,0.9)';
    overlay.style.border = '1px solid #3f3f46';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.innerHTML = `
       <div id="prompto-review-title" style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${strategy}</div>
       <div style="margin-top:6px;display:inline-flex;gap:12px;">
         <button class="accept" style="all:unset;cursor:pointer;padding:0 12px;height:20px;font-size:11px;border-radius:2px;background:#10b981;color:#fff;">Accept</button>
         <button class="reject" style="all:unset;cursor:pointer;padding:0 12px;height:20px;font-size:11px;border-radius:2px;color:#d1d5db;">Reject</button>
         <a style="font-size:11px;color:#a1a1aa;text-decoration:underline dotted 1px #52525b;cursor:pointer;" tabindex="-1">Follow-up instructions…</a>
       </div>
    `;

    const composerRow = textarea.closest('form') || textarea.parentElement;
    if (composerRow && getComputedStyle(composerRow).position === 'static') {
      composerRow.style.position = 'relative';
    }
    composerRow.appendChild(overlay);

    overlay.style.position = 'absolute';
    overlay.style.top = `-${overlay.offsetHeight + 16}px`;
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';

    textarea.dataset.oldStyle = textarea.getAttribute('style') || '';
    textarea.dataset.oldHeight = textarea.style.height || '';
    textarea.dataset.oldOverflow = textarea.style.overflowY || '';
    textarea.style.background = '#14532d';
    textarea.style.color = '#f0fdf4';
    textarea.style.border = '1px solid #22c55e';
    textarea.style.boxShadow = 'inset 0 32px #7f1d1d';

    // ---------- Auto-expand logic ----------
    function autoGrow(el) {
      el.style.height = 'auto';
      el.style.overflowY = 'hidden';
      const max = window.innerHeight * 0.4; // ≈ 40% of viewport height
      const newH = Math.min(el.scrollHeight + 2, max);
      el.style.height = newH + 'px';
      if (newH >= max) {
        el.style.overflowY = 'auto';
      }
    }

    textarea.classList.add('prompto-preview');
    autoGrow(textarea); // initial grow on open
    const growHandler = () => autoGrow(textarea);
    textarea.addEventListener('input', growHandler);

    /* ---------- Suggestion preview overlay ---------- */
    const container = textarea.parentElement;
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    const suggestion = document.createElement('div');
    suggestion.className = 'prompto-suggestion';
    suggestion.textContent = enhanced;

    Object.assign(suggestion.style, {
      position: 'absolute',
      inset: '0',          // fill the input area
      padding: '8px',
      background: '#14532d',
      color: '#f0fdf4',
      border: '1px solid #22c55e',
      borderRadius: getComputedStyle(textarea).borderRadius || '4px',
      whiteSpace: 'pre-wrap',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      pointerEvents: 'none',
      overflowY: 'auto',
      zIndex: '999999998',
      opacity: '0.95',
      boxSizing: 'border-box'
    });

    container.appendChild(suggestion);

    function syncSuggestionSize() {
      // Ensures overlay matches textarea size when it grows via typing
      suggestion.style.borderRadius = getComputedStyle(textarea).borderRadius || '4px';
    }

    const resizeObserver = new ResizeObserver(syncSuggestionSize);
    resizeObserver.observe(textarea);

    overlay.querySelector('.accept').onclick = apply;
    overlay.querySelector('.reject').onclick = cleanup;

    function apply() {
      if ('value' in textarea) textarea.value = enhanced;
      else textarea.textContent = enhanced;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      cleanup();
      showToast('Prompt enhanced!', 'success');
    }

    function cleanup() {
      overlay.remove();
      suggestion.remove();
      resizeObserver.disconnect();
      textarea.setAttribute('style', textarea.dataset.oldStyle);
      textarea.classList.remove('prompto-preview');
      textarea.style.height = textarea.dataset.oldHeight;
      textarea.style.overflowY = textarea.dataset.oldOverflow;
      textarea.removeEventListener('input', growHandler);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', clickAway, true);
      window.removeEventListener('resize', syncSuggestionSize);
      textarea.removeEventListener('input', syncSuggestionSize);
    }

    function onKey(e) {
      if (e.key === 'Enter') { e.preventDefault(); apply(); }
      if (e.key === 'Escape') { e.preventDefault(); cleanup(); }
    }

    function clickAway(e) {
      if (!overlay.contains(e.target)) cleanup();
    }

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', clickAway, { capture: true });
  }

  function enhancePrompt(textarea) {
    if (!textarea) {
      textarea = getCurrentPromptElement();
    }
    const text = (textarea?.value || textarea?.textContent || '').trim();
    if (text.length < 5 && textarea) {
      // maybe grabbed wrong element, attempt to find a better candidate
      const alt = getCurrentPromptElement();
      if (alt && alt !== textarea) {
        textarea = alt;
      }
    }
    const finalText = (textarea?.value || textarea?.textContent || '').trim();
    const textToUse = finalText;
    if (text.length < 5) {
      return showBanner('📝 Enter at least 5 characters to enhance', 'warn', ICONS.sparkles);
    }
    
    // Show loading banner
    showBanner('🚀 Enhancing your prompt with GPT-4...', 'info', ICONS.spinner);
    
    chrome.runtime.sendMessage({ action: 'enhancePrompt', prompt: textToUse }, (response) => {
      if (!response?.success) {
        const errorMsg = response?.error || 'Enhancement failed';
        const displayMsg = errorMsg.includes('Backend not running') 
          ? '🔌 Backend server is offline - Please start the backend'
          : `❌ Enhancement failed: ${errorMsg}`;
        return showBanner(displayMsg, 'error', '⚠️');
      }
      
      showEnhancementOverlay({
        textarea,
        original: text,
        enhanced: response.enhanced,
        strategy: response.strategy || 'Prompt Enhancement Suggestion'
      });
    });
  }

  function createChild(fab, index, icon, title, callback, className = '', label = '') {
    const child = document.createElement('button');
    child.type = 'button';
    child.className = `${CLASSES.btn} ${CLASSES.child} ${className}`;
    child.title = title;
    child.innerHTML = icon;
    child.setAttribute('data-label', label || title);
    child.setAttribute('data-index', index);
    child.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      callback();
      toggleSpeedDial(fab);
    };
    
    // Position will be set by positionChild function
    child.style.cssText = `
      position: fixed !important; 
      z-index: 999999999 !important; 
      isolation: isolate !important;
      transform-style: preserve-3d !important;
      transform: scale(0.3) translateZ(0) !important;
      opacity: 0 !important;
      pointer-events: none !important;
    `;
    
    document.body.appendChild(child);
    
    // Position the child relative to the FAB
    positionChild(child, fab, index);
    
    requestAnimationFrame(() => {
      child.style.transform = `scale(1) translateZ(0)`;
      child.style.opacity = '1';
      child.style.pointerEvents = 'auto';
    });
    
    return child;
  }

  function positionChild(child, fab, index) {
    const fabRect = fab.getBoundingClientRect();
    const fabCenterX = fabRect.left + fabRect.width / 2;
    const fabTop = fabRect.top;
    
    const childX = fabCenterX - 20; // Centered for 40px width
    const childY = fabTop - (65 + (50 * (index - 1))); // Better spacing
    
    child.style.left = `${childX}px`;
    child.style.top = `${childY}px`;
  }

  function openSpeedDial(fab) {
    console.log('🚀 Prompto: Opening speed dial', fab.getBoundingClientRect());

    // Enhance Prompt Button – green with sparkles
    createChild(
      fab,
      1,
      ICONS.sparkles,
      'Enhance Prompt with GPT-4',
      () => enhancePrompt(getCurrentPromptElement()),
      'enhance',
      'Enhance Prompt'
    );

    // Token Optimizer Button – orange construction placeholder
    createChild(
      fab,
      2,
      ICONS.construction,
      'Token Optimizer (Under Construction)',
      () => showBanner('🚧 Token Optimizer is under construction! Coming soon with advanced compression algorithms.', 'construction', ICONS.construction),
      'construction',
      'Token Optimizer'
    );
    
    // Ensure children are positioned correctly after creation
    setTimeout(() => updateChildPositions(), 50);
    
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

  let currentAnchor = null; // stores anchor element for repositioning

  function mountFAB() {
    if ($(`.${CLASSES.wrapper}`)) return;
    const anchorInfo = findAnchor();
    if (!anchorInfo) {
      console.log('🚀 Prompto: No anchor found, retrying...');
      return;
    }

    const { element: anchor } = anchorInfo;
    currentAnchor = anchor;
    const { position } = anchorInfo;
    const parent = anchor.parentElement;
    if (!parent) {
      console.log('🚀 Prompto: No parent found for anchor');
      return;
    }

    console.log('🚀 Prompto: Mounting FAB at anchor:', anchor, 'position:', position);
    console.log('🚀 Prompto: Parent element:', parent);

    const wrapper = document.createElement('div');
    wrapper.className = CLASSES.wrapper;
    wrapper.style.cssText = `
      display: flex !important;
      align-items: center !important;
      margin: 0 4px !important;
    `;

    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = `${CLASSES.btn} ${CLASSES.fab}`;
    fab.innerHTML = ICONS.plus;
    fab.title = 'Prompto AI Assistant';
    fab.dataset.open = '0';
    fab.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      toggleSpeedDial(fab);
    };
    // Force maximum z-index with inline styles
    fab.style.cssText = `
      position: relative !important; 
      z-index: 999999999 !important; 
      isolation: isolate !important;
      transform: translateZ(0) !important;
      transform-style: preserve-3d !important;
    `;

    wrapper.appendChild(fab);

    console.log('🚀 Prompto: Wrapper created, inserting into DOM');
    if (position === 'after') {
      parent.insertBefore(wrapper, anchor.nextSibling);
      console.log('🚀 Prompto: Inserted after anchor');
    } else {
      parent.insertBefore(wrapper, anchor);
      console.log('🚀 Prompto: Inserted before anchor');
    }

    console.log('🚀 Prompto: Wrapper in DOM:', document.contains(wrapper));
    console.log('🚀 Prompto: Wrapper styles:', wrapper.style.cssText);
    console.log('🚀 Prompto: FAB styles:', fab.style.cssText);
    console.log('🚀 Prompto: FAB mounted successfully');
  }

  function updateChildPositions() {
    const fab = $(`.${CLASSES.fab}`);
    const children = $$(`.${CLASSES.child}`);
    
    if (!fab || children.length === 0) return;
    
    children.forEach((child) => {
      const index = parseInt(child.getAttribute('data-index') || '1');
      positionChild(child, fab, index);
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

