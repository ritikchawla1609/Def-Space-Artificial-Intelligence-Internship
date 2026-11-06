// Style Spy Content Script
// Analyzes visible DOM elements, counts colors by frequency & detects typography
(function () {
  'use strict';

  function extractPageStyles() {
    const colorCounts = {};
    const headingFonts = {};
    const bodyFonts = {};

    const elements = document.querySelectorAll('body *');
    const sampleLimit = Math.min(elements.length, 400);

    for (let i = 0; i < sampleLimit; i++) {
      const el = elements[i];
      // Skip invisible elements
      if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;

      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const textCol = style.color;

      recordColor(bg, colorCounts);
      recordColor(textCol, colorCounts);

      // Typography
      const family = style.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      const weight = style.fontWeight;
      const size = style.fontSize;
      const tag = el.tagName.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        const key = `${family}|${weight}|${size}`;
        headingFonts[key] = (headingFonts[key] || 0) + 1;
      } else if (tag === 'p' || tag === 'span' || tag === 'body') {
        const key = `${family}|${weight}|${size}`;
        bodyFonts[key] = (bodyFonts[key] || 0) + 1;
      }
    }

    // Rank colors by frequency
    const sortedColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([hex, count]) => ({ hex, count }));

    // Extract top heading & body font
    const topHeadingKey = Object.entries(headingFonts).sort((a, b) => b[1] - a[1])[0];
    const topBodyKey = Object.entries(bodyFonts).sort((a, b) => b[1] - a[1])[0];

    const fonts = [];
    if (topHeadingKey) {
      const [family, weight, size] = topHeadingKey[0].split('|');
      fonts.push({ family, weight, size, role: 'heading' });
    } else {
      fonts.push({ family: 'Inter', weight: '700', size: '28px', role: 'heading' });
    }

    if (topBodyKey) {
      const [family, weight, size] = topBodyKey[0].split('|');
      fonts.push({ family, weight, size, role: 'body' });
    } else {
      fonts.push({ family: 'Lora', weight: '400', size: '15px', role: 'body' });
    }

    return { colors: sortedColors, fonts };
  }

  function recordColor(rgbStr, map) {
    if (!rgbStr || rgbStr === 'transparent' || rgbStr === 'rgba(0, 0, 0, 0)') return;
    const hex = rgbToHex(rgbStr);
    if (hex) {
      map[hex] = (map[hex] || 0) + 1;
    }
  }

  function rgbToHex(rgbStr) {
    const match = rgbStr.match(/\d+/g);
    if (!match || match.length < 3) return null;
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'EXTRACT_STYLES') {
        sendResponse(extractPageStyles());
      }
      return true;
    });
  }
})();
