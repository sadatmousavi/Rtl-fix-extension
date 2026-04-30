// content.js - RTL/LTR Toggle for AI Chat Sites
// Force RTL on Persian/Arabic text, keep LTR for code blocks and English
// Compatible with: Claude.ai, Gemini, DeepSeek, Copilot, Poe, Duck.ai

(function () {
  'use strict';

  // ========================== Constants ==========================
  const STORAGE_KEY = 'ai_chat_rtl_enabled';
  const UNIFIED_FONT = 'system-ui, -apple-system, "Segoe UI", "Noto Sans Arabic", Tahoma, sans-serif';

  const ALLOWED_HOSTS = [
    'claude.ai',
    'gemini.google.com',
    'chat.deepseek.com',
    'www.deepseek.com',
    'copilot.microsoft.com',
    'poe.com',
    'duck.ai',
  ];

  const currentHost = window.location.hostname;
  let rtlEnabled = true; // default state

  // ========================== Helper Functions ==========================
  /**
   * Detect if a text contains RTL script (Persian/Arabic)
   * @param {string} text
   * @returns {boolean}
   */
  const isRTLText = (text) => {
    if (!text || text.length < 3) return false;
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    let rtlCount = 0;
    let latinCount = 0;
    const limit = Math.min(text.length, 100);

    for (let i = 0; i < limit; i++) {
      const ch = text[i];
      if (rtlRegex.test(ch)) rtlCount++;
      else if (/[A-Za-z]/.test(ch)) latinCount++;
      if (rtlCount > latinCount * 0.3) return true;
    }
    return rtlCount > latinCount * 0.3;
  };

  /**
   * Check if an element is a code block (should stay LTR)
   * @param {HTMLElement} el
   * @returns {boolean}
   */
  const isCodeElement = (el) => {
    if (!el) return false;
    if (el.tagName === 'CODE' || el.tagName === 'PRE' || el.tagName === 'XMP') return true;

    if (el.className && typeof el.className === 'string') {
      const cls = el.className.toLowerCase();
      if (
        cls.includes('code') ||
        cls.includes('hljs') ||
        cls.includes('syntax') ||
        cls.includes('prettyprint') ||
        cls.includes('source') ||
        cls.includes('programming') ||
        cls.includes('code-block') ||
        cls.includes('source-code') ||
        cls.includes('language-') ||
        cls.includes('highlight') ||
        cls.includes('markdown-code') ||
        cls.includes('notranslate')
      ) {
        return true;
      }
    }

    let parent = el.parentElement;
    for (let i = 0; i < 5 && parent; i++) {
      if (parent.tagName === 'CODE' || parent.tagName === 'PRE') return true;
      if (parent.className && typeof parent.className === 'string') {
        const pCls = parent.className.toLowerCase();
        if (
          pCls.includes('code') ||
          pCls.includes('hljs') ||
          pCls.includes('syntax') ||
          pCls.includes('prettyprint') ||
          pCls.includes('code-block')
        ) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    return false;
  };

  /**
   * Apply RTL or LTR class to a single element (skip code elements)
   * @param {HTMLElement} el
   */
  const applyDirectionClass = (el) => {
    if (!el || el.nodeType !== 1) return;
    if (isCodeElement(el)) return;
    if (el.closest('script, style')) return;

    const text = el.textContent || '';
    if (text.length < 3) return;

    if (isRTLText(text)) {
      el.classList.add('rtl-assistant-persian');
      el.classList.remove('rtl-assistant-english');
    } else {
      el.classList.add('rtl-assistant-english');
      el.classList.remove('rtl-assistant-persian');
    }
  };

  /**
   * Recursively process node tree (skip code containers)
   * @param {HTMLElement} node
   */
  const processNodeTree = (node) => {
    if (!node || node.nodeType !== 1) return;
    if (isCodeElement(node)) return;
    applyDirectionClass(node);
    node.childNodes.forEach((child) => {
      if (child.nodeType === 1) processNodeTree(child);
    });
  };

  /**
   * Process input fields (textarea / contenteditable) dynamically
   * @param {HTMLElement} el
   */
  const processInputElement = (el) => {
    const text = el.value || el.innerText || '';
    if (isRTLText(text)) {
      el.setAttribute('dir', 'rtl');
      el.style.direction = 'rtl';
      el.style.textAlign = 'right';
    } else {
      el.setAttribute('dir', 'ltr');
      el.style.direction = 'ltr';
      el.style.textAlign = 'left';
    }
  };

  // ========================== Main DOM Manipulation ==========================
  /**
   * Full page scan: apply RTL/LTR to all relevant containers and inputs
   */
  const fullScan = () => {
    const selectors = [
      'p',
      'div',
      'span',
      'li',
      'article',
      'section',
      '[class*="message"]',
      '[class*="chat"]',
      '[class*="content"]',
      '[class*="text"]',
    ];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => processNodeTree(el));
    });

    // Input elements
    document.querySelectorAll('textarea, [contenteditable="true"]').forEach(processInputElement);
  };

  /**
   * Remove all applied RTL/LTR classes and inline styles
   */
  const fullRemove = () => {
    document.querySelectorAll('.rtl-assistant-persian, .rtl-assistant-english').forEach((el) => {
      el.classList.remove('rtl-assistant-persian', 'rtl-assistant-english');
    });
    document.querySelectorAll('textarea, [contenteditable="true"]').forEach((el) => {
      el.removeAttribute('dir');
      el.style.direction = '';
      el.style.textAlign = '';
    });
  };

  // ========================== Mutation Observer ==========================
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'childList') continue;
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        processNodeTree(node);
        if (node.querySelectorAll) {
          node.querySelectorAll('textarea, [contenteditable="true"]').forEach(processInputElement);
        }
      }
    }
  });

  // ========================== Event Handlers ==========================
  let inputTimer = null;
  const handleInput = (e) => {
    const el = e.target;
    if (!el || (el.tagName !== 'TEXTAREA' && !el.isContentEditable)) return;
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
      if (!rtlEnabled) return;
      processInputElement(el);
    }, 50);
  };

  // ========================== UI: Floating Toggle Button ==========================
  const createToggleButton = () => {
    if (!ALLOWED_HOSTS.includes(currentHost)) return;
    const oldButton = document.getElementById('rtl-toggle-btn');
    if (oldButton) oldButton.remove();

    const button = document.createElement('button');
    button.id = 'rtl-toggle-btn';
    button.textContent = rtlEnabled ? 'RTL ON' : 'RTL OFF';
    button.className = rtlEnabled ? '' : 'rtl-off';

    button.addEventListener('click', async () => {
      rtlEnabled = !rtlEnabled;
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ [STORAGE_KEY]: rtlEnabled });
      }
      button.textContent = rtlEnabled ? 'RTL ON' : 'RTL OFF';
      button.className = rtlEnabled ? '' : 'rtl-off';

      if (rtlEnabled) {
        fullScan();
      } else {
        fullRemove();
      }
    });

    document.body.appendChild(button);
  };

  // ========================== CSS Injection ==========================
  const injectStyles = () => {
    if (document.getElementById('rtl-assistant-styles')) return;
    const style = document.createElement('style');
    style.id = 'rtl-assistant-styles';
    style.textContent = `
      .rtl-assistant-persian {
        direction: rtl !important;
        text-align: right !important;
        font-family: ${UNIFIED_FONT};
        unicode-bidi: embed !important;
      }
      .rtl-assistant-english {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: isolate !important;
        font-family: ${UNIFIED_FONT};
      }
      /* Force LTR for all code-related elements */
      pre, code, .code-block, .hljs, .syntaxhighlighter, .prettyprint,
      [class*="language-"], [class*="sourceCode"], .markdown-pre, .notranslate,
      pre *, code *, .code-block *, .hljs *, [class*="language-"] * {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: normal !important;
      }
      #rtl-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 13px;
        font-weight: bold;
        background-color: #10b981;
        color: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
      }
      #rtl-toggle-btn.rtl-off {
        background-color: #ef4444;
      }
    `;
    document.head.appendChild(style);
  };

  // ========================== Initialization ==========================
  const init = async () => {
    // Load saved state
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.local.get([STORAGE_KEY]);
      if (result[STORAGE_KEY] === false) rtlEnabled = false;
      else if (result[STORAGE_KEY] === undefined) {
        await chrome.storage.local.set({ [STORAGE_KEY]: true });
      }
    }

    injectStyles();
    createToggleButton();

    if (rtlEnabled) fullScan();

    // Start observing DOM changes
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Global input listener for dynamic fields
    document.addEventListener('input', handleInput);
  };

  // Start after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();