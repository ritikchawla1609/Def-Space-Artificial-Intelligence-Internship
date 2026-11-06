// YouTube Focus Board Content Script
// Automatically reapplies blockers on SPA navigation without reloads
(function () {
  'use strict';

  let currentSettings = {
    hideShorts: true,
    hideRecs: true,
    hideComments: true,
    gateUnlockExpiry: 0,
    gatePurpose: ''
  };

  function applyBlockers() {
    let styleEl = document.getElementById('yt-focus-board-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'yt-focus-board-styles';
      document.head.appendChild(styleEl);
    }

    let css = '';
    if (currentSettings.hideShorts) {
      css += `
        ytd-reel-shelf-renderer,
        ytd-rich-shelf-renderer[is-shorts],
        ytd-mini-guide-entry-renderer[aria-label="Shorts"],
        ytd-guide-entry-renderer:has(a[title="Shorts"]),
        a[href^="/shorts"] {
          display: none !important;
        }
      `;
    }

    if (currentSettings.hideRecs) {
      css += `
        #secondary,
        #related,
        ytd-watch-next-secondary-results-renderer {
          display: none !important;
        }
      `;
    }

    if (currentSettings.hideComments) {
      css += `
        #comments,
        ytd-comments {
          display: none !important;
        }
      `;
    }

    styleEl.textContent = css;
  }

  // Handle SPA navigation on YouTube
  const observer = new MutationObserver(() => {
    applyBlockers();
  });
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

  // Chrome message listener
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'SETTINGS_UPDATED') {
        currentSettings = { ...currentSettings, ...msg.settings };
        applyBlockers();
      } else if (msg.type === 'JUMP_TIMESTAMP') {
        const video = document.querySelector('video');
        if (video) {
          video.currentTime = msg.seconds;
          video.play();
        }
      }
    });
  }

  applyBlockers();
})();
