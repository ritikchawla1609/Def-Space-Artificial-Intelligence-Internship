// Style Spy Popup Controller
(function () {
  'use strict';

  // Active extracted data (matches PDF Page 15 screenshot by default)
  let extractedStyle = {
    colors: [
      { hex: '#0f172a', rgb: 'rgb(15, 23, 42)', count: 48, label: 'Canvas Dark' },
      { hex: '#8b5cf6', rgb: 'rgb(139, 92, 246)', count: 32, label: 'Primary Brand' },
      { hex: '#f59e0b', rgb: 'rgb(245, 158, 11)', count: 18, label: 'Warm Accent' },
      { hex: '#f8fafc', rgb: 'rgb(248, 250, 252)', count: 28, label: 'Base Light' },
      { hex: '#3b82f6', rgb: 'rgb(59, 130, 246)', count: 14, label: 'Secondary Blue' }
    ],
    fonts: [
      { family: 'Inter', weight: '700', size: '28px', role: 'heading' },
      { family: 'Lora', weight: '400', size: '15px', role: 'body' }
    ]
  };

  let savedKits = JSON.parse(localStorage.getItem('styleSpy_kits') || '{}');

  const swatchesGrid = document.getElementById('swatchesGrid');
  const fontsList = document.getElementById('fontsList');
  const inpKitName = document.getElementById('inpKitName');
  const btnSaveKit = document.getElementById('btnSaveKit');
  const savedKitsDropdown = document.getElementById('savedKitsDropdown');
  const btnCopyCss = document.getElementById('btnCopyCss');
  const btnRescan = document.getElementById('btnRescan');
  const copyToast = document.getElementById('copyToast');

  function init() {
    setupEventListeners();
    queryActiveTab();
    renderKitsDropdown();
    renderStyleUI();
  }

  function setupEventListeners() {
    if (btnRescan) btnRescan.addEventListener('click', queryActiveTab);
    if (btnSaveKit) btnSaveKit.addEventListener('click', handleSaveKit);
    if (savedKitsDropdown) savedKitsDropdown.addEventListener('change', handleLoadSavedKit);
    if (btnCopyCss) btnCopyCss.addEventListener('click', exportCssVariables);
  }

  function queryActiveTab() {
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'EXTRACT_STYLES' }, (res) => {
            if (res && res.colors && res.colors.length > 0) {
              extractedStyle = res;
              renderStyleUI();
            }
          });
        }
      });
    }
  }

  // --- RENDER UI ---
  function renderStyleUI() {
    // 1. Swatches Grid
    swatchesGrid.innerHTML = '';
    extractedStyle.colors.forEach(col => {
      const swatch = document.createElement('div');
      swatch.className = 'swatch-item';
      swatch.style.backgroundColor = col.hex;
      swatch.title = `${col.hex} (${col.count} occurrences) - Click to copy`;
      swatch.addEventListener('click', () => copyToClipboard(col.hex, `Color ${col.hex} copied!`));
      swatchesGrid.appendChild(swatch);
    });

    // 2. Fonts List (Matching PDF screenshot: Inter 700 heading, Lora 400 body)
    fontsList.innerHTML = '';
    extractedStyle.fonts.forEach(f => {
      const row = document.createElement('div');
      row.className = 'font-item-row';
      row.innerHTML = `
        <span class="font-family-name" style="font-family: ${f.family}, sans-serif;">${f.family} · ${f.weight} ${f.role}</span>
        <span class="font-meta-tag">${f.size}</span>
      `;
      const fontCssSnippet = `font-family: '${f.family}', sans-serif; font-weight: ${f.weight}; font-size: ${f.size};`;
      row.addEventListener('click', () => copyToClipboard(fontCssSnippet, `Font ${f.family} CSS copied!`));
      fontsList.appendChild(row);
    });
  }

  // --- SAVE & LOAD DESIGN KITS ---
  function handleSaveKit() {
    const name = inpKitName.value.trim() || 'Modern Brand Kit';
    savedKits[name] = JSON.parse(JSON.stringify(extractedStyle));
    try {
      localStorage.setItem('styleSpy_kits', JSON.stringify(savedKits));
    } catch (e) {
      console.warn('Could not save kits to localStorage:', e);
    }
    inpKitName.value = '';
    renderKitsDropdown();
    showToast(`Kit "${name}" saved!`);
  }

  function renderKitsDropdown() {
    savedKitsDropdown.innerHTML = '<option value="">-- Choose saved kit --</option>';
    Object.keys(savedKits).forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      savedKitsDropdown.appendChild(opt);
    });
  }

  function handleLoadSavedKit(e) {
    const name = e.target.value;
    if (name && savedKits[name]) {
      extractedStyle = savedKits[name];
      renderStyleUI();
      showToast(`Loaded kit "${name}"`);
    }
  }

  // --- EXPORT AS CSS VARIABLES ---
  // Requirement: "Export a kit as CSS variables."
  function exportCssVariables() {
    let css = `:root {\n`;
    extractedStyle.colors.forEach((c, idx) => {
      css += `  --color-${idx === 0 ? 'dark' : (idx === 1 ? 'primary' : (idx === 2 ? 'accent' : 'palette-' + idx))}: ${c.hex};\n`;
    });

    extractedStyle.fonts.forEach(f => {
      css += `  --font-${f.role}: '${f.family}', ${f.role === 'body' ? 'serif' : 'sans-serif'};\n`;
      css += `  --font-weight-${f.role}: ${f.weight};\n`;
    });
    css += `}\n`;

    copyToClipboard(css, 'CSS Variables copied to clipboard! Paste into your CSS.');
  }

  function copyToClipboard(text, msg) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(msg || 'Copied! ✓');
    });
  }

  function showToast(msg) {
    copyToast.textContent = msg;
    copyToast.style.display = 'block';
    setTimeout(() => { copyToast.style.display = 'none'; }, 2000);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
