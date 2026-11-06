// Chat Saver Content Script
// Scrapes ChatGPT, Claude, and Gemini chats into structured Markdown objects
(function () {
  'use strict';

  function scrapeActiveChat() {
    let title = document.title.replace(/ - (ChatGPT|Claude|Gemini)/i, '').trim();
    const messages = [];

    // 1. ChatGPT Selectors
    const gptMessages = document.querySelectorAll('[data-message-author-role]');
    if (gptMessages.length > 0) {
      gptMessages.forEach(el => {
        const role = el.getAttribute('data-message-author-role');
        const text = el.innerText;
        messages.push({ role, text });
      });
    }

    // 2. Claude Selectors
    const claudeUser = document.querySelectorAll('.font-user-message');
    const claudeAssistant = document.querySelectorAll('.font-claude-message');
    if (claudeUser.length > 0 || claudeAssistant.length > 0) {
      document.querySelectorAll('[data-testid="user-message"], .font-claude-message').forEach(el => {
        const isUser = el.classList.contains('font-user-message') || el.closest('[data-testid="user-message"]');
        messages.push({
          role: isUser ? 'user' : 'assistant',
          text: el.innerText
        });
      });
    }

    // 3. Gemini Selectors
    const geminiTurns = document.querySelectorAll('user-query, model-response');
    if (geminiTurns.length > 0) {
      geminiTurns.forEach(el => {
        const role = el.tagName.toLowerCase().includes('user') ? 'user' : 'assistant';
        messages.push({ role, text: el.innerText });
      });
    }

    // Count code blocks
    const codeBlockCount = document.querySelectorAll('pre code, .code-block').length;

    return {
      title: title || 'AI Conversation Export',
      messageCount: messages.length,
      codeBlockCount: codeBlockCount,
      messages: messages
    };
  }

  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'SCRAPE_CHAT') {
        sendResponse(scrapeActiveChat());
      }
      return true;
    });
  }
})();
