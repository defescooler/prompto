// Claude integration. Do not share logic or selectors with ChatGPT.

(function() {
  if (window.__PROMPTO_CLAUDE_LOADED) return;
  window.__PROMPTO_CLAUDE_LOADED = true;

  const CLAUDE_FAB_CLASS = 'prompto-claude-fab';
  const CLAUDE_SPINNER_CLASS = 'prompto-claude-spinner';

  function injectStyles() {
    if (document.getElementById('prompto-claude-styles')) return;
    const style = document.createElement('style');
    style.id = 'prompto-claude-styles';
    style.textContent = `
      .${CLAUDE_FAB_CLASS} {
        height: 32px !important;
        min-width: 32px !important;
        border-radius: 8px !important;
        background: linear-gradient(135deg, #10b981 0%, #0d9488 100%) !important;
        color: #fff !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 6px !important;
        border: none !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(16,185,129,0.08);
        transition: background 0.2s;
        position: relative;
      }
      .${CLAUDE_FAB_CLASS}:hover {
        background: linear-gradient(135deg, #0d9488 0%, #10b981 100%) !important;
      }
      .${CLAUDE_SPINNER_CLASS} {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 18px;
        height: 18px;
        margin-left: -9px;
        margin-top: -9px;
        border: 2px solid #fff;
        border-top: 2px solid #10b981;
        border-radius: 50%;
        animation: prompto-claude-spin 0.7s linear infinite;
        z-index: 2;
        background: none;
      }
      @keyframes prompto-claude-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function findClaudeButtonRow() {
    // .flex.gap-2\.5.w-full.items-center
    return document.querySelector('.flex.gap-2\\.5.w-full.items-center');
  }

  function findSendButton(row) {
    // Find the send button by aria-label
    return row && row.querySelector('button[aria-label="Send message"]');
  }

  function findClaudeInput() {
    return document.querySelector('.ProseMirror[contenteditable="true"]');
  }

  function getClaudePrompt() {
    const input = findClaudeInput();
    return input ? input.innerText : '';
  }

  function setClaudePrompt(text) {
    const input = findClaudeInput();
    if (!input) return;
    // Replace all content with the enhanced prompt
    input.innerText = text;
    // Place cursor at end
    const range = document.createRange();
    range.selectNodeContents(input);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    input.focus();
  }

  function showSpinner(fab) {
    if (fab.querySelector('.' + CLAUDE_SPINNER_CLASS)) return;
    const spinner = document.createElement('div');
    spinner.className = CLAUDE_SPINNER_CLASS;
    fab.appendChild(spinner);
  }

  function hideSpinner(fab) {
    const spinner = fab.querySelector('.' + CLAUDE_SPINNER_CLASS);
    if (spinner) spinner.remove();
  }

  function showToast(msg) {
    // Minimal toast for Claude
    let toast = document.getElementById('prompto-claude-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'prompto-claude-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '32px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(16,185,129,0.98)';
      toast.style.color = '#fff';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '8px';
      toast.style.fontSize = '16px';
      toast.style.zIndex = '999999';
      toast.style.boxShadow = '0 2px 8px rgba(16,185,129,0.18)';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2200);
  }

  async function enhanceClaudePrompt(fab) {
    const prompt = getClaudePrompt();
    if (!prompt.trim()) {
      showToast('Prompt is empty.');
      return;
    }
    showSpinner(fab);
    chrome.runtime.sendMessage(
      { type: 'PROMPTO_ENHANCE', prompt },
      (response) => {
        hideSpinner(fab);
        if (response && response.success && response.data && response.data.enhanced_prompt) {
          setClaudePrompt(response.data.enhanced_prompt);
          showToast('Prompt enhanced!');
        } else {
          showToast('Enhancement failed.');
        }
      }
    );
  }

  function mountClaudeFAB() {
    injectStyles();
    const row = findClaudeButtonRow();
    if (!row) {
      console.log('🚀 Prompto: Claude button row not found');
      return;
    }
    if (row.querySelector('.' + CLAUDE_FAB_CLASS)) {
      // Already mounted
      return;
    }
    const sendBtn = findSendButton(row);
    const fab = document.createElement('button');
    fab.className = CLAUDE_FAB_CLASS;
    fab.title = 'Enhance with Prompto';
    fab.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="white" fill-opacity="0.12"/><path d="M7 12.5L11 16.5L17 8.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    fab.onclick = () => enhanceClaudePrompt(fab);
    // Defensive: only insertBefore if sendBtn is a child of row
    if (sendBtn && sendBtn.parentNode === row) {
      row.insertBefore(fab, sendBtn);
      console.log('🚀 Prompto: Claude FAB inserted before send button');
    } else {
      row.appendChild(fab);
      console.log('🚀 Prompto: Claude FAB appended to button row (send button not found or not a child)');
    }
  }

  // Observe DOM for dynamic changes
  const observer = new MutationObserver(() => {
    setTimeout(mountClaudeFAB, 50);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(mountClaudeFAB, 100);
})(); 