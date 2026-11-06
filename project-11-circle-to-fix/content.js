// Circle to Fix — Content Script
// Allows drawing annotations over any page, inspecting DOM elements & generating prompts
(function () {
  'use strict';

  let isOverlayActive = false;
  let overlayCanvas = null;
  let oCtx = null;
  let isDrawing = false;
  let startX = 0, startY = 0;
  let drawShape = 'circle'; // 'circle' | 'box' | 'arrow'
  let strokePoints = [];

  // Listen for shortcut Alt+Shift+C
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
      toggleDrawingOverlay();
    }
    if (e.key === 'Escape' && isOverlayActive) {
      removeOverlay();
    }
  });

  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'START_DRAWING') toggleDrawingOverlay();
    });
  }

  function toggleDrawingOverlay() {
    if (isOverlayActive) removeOverlay();
    else createOverlay();
  }

  function createOverlay() {
    isOverlayActive = true;

    // Overlay Container
    const container = document.createElement('div');
    container.id = 'circle-to-fix-root';
    container.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: 999999; cursor: crosshair; user-select: none;
    `;

    // Canvas
    overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = window.innerWidth;
    overlayCanvas.height = window.innerHeight;
    overlayCanvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
    oCtx = overlayCanvas.getContext('2d');

    // Floating Tool Palette
    const palette = document.createElement('div');
    palette.id = 'ctf-palette';
    palette.style.cssText = `
      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
      background: #0f172a; border: 1.5px solid #334155; border-radius: 30px;
      padding: 8px 16px; display: flex; align-items: center; gap: 12px;
      color: #fff; font-family: sans-serif; font-size: 13px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    `;
    palette.innerHTML = `
      <span style="font-weight:700; color:#f43f5e;">⭕ Circle to Fix</span>
      <button id="ctfCircle" style="background:#ef4444; color:#fff; border:none; padding:4px 10px; border-radius:12px; cursor:pointer;">Circle</button>
      <button id="ctfBox" style="background:#334155; color:#fff; border:none; padding:4px 10px; border-radius:12px; cursor:pointer;">Box</button>
      <button id="ctfArrow" style="background:#334155; color:#fff; border:none; padding:4px 10px; border-radius:12px; cursor:pointer;">Arrow</button>
      <span style="color:#64748b;">| Draw over problem element</span>
      <button id="ctfClose" style="background:none; border:none; color:#ef4444; font-size:18px; cursor:pointer;">&times;</button>
    `;

    container.appendChild(overlayCanvas);
    container.appendChild(palette);
    document.body.appendChild(container);

    setupDrawingEvents(container);
  }

  function removeOverlay() {
    const root = document.getElementById('circle-to-fix-root');
    if (root) root.remove();
    const promptModal = document.getElementById('ctf-prompt-modal');
    if (promptModal) promptModal.remove();
    isOverlayActive = false;
  }

  function setupDrawingEvents(container) {
    document.getElementById('ctfCircle').onclick = () => { drawShape = 'circle'; updatePaletteButtons(); };
    document.getElementById('ctfBox').onclick = () => { drawShape = 'box'; updatePaletteButtons(); };
    document.getElementById('ctfArrow').onclick = () => { drawShape = 'arrow'; updatePaletteButtons(); };
    document.getElementById('ctfClose').onclick = removeOverlay;

    function updatePaletteButtons() {
      ['ctfCircle', 'ctfBox', 'ctfArrow'].forEach(id => {
        const btn = document.getElementById(id);
        const active = (id === 'ctfCircle' && drawShape === 'circle') ||
                       (id === 'ctfBox' && drawShape === 'box') ||
                       (id === 'ctfArrow' && drawShape === 'arrow');
        btn.style.backgroundColor = active ? '#ef4444' : '#334155';
      });
    }

    overlayCanvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
      strokePoints = [{ x: startX, y: startY }];
    });

    overlayCanvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const currentX = e.clientX;
      const currentY = e.clientY;

      oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      oCtx.strokeStyle = '#ef4444'; // Red circle/pen
      oCtx.lineWidth = 3.5;
      oCtx.lineCap = 'round';

      if (drawShape === 'circle') {
        // Red ellipse
        const radiusX = Math.abs(currentX - startX) / 2;
        const radiusY = Math.abs(currentY - startY) / 2;
        const centerX = (startX + currentX) / 2;
        const centerY = (startY + currentY) / 2;
        oCtx.beginPath();
        oCtx.ellipse(centerX, centerY, Math.max(5, radiusX), Math.max(5, radiusY), 0, 0, Math.PI * 2);
        oCtx.stroke();
      } else if (drawShape === 'box') {
        oCtx.strokeRect(startX, startY, currentX - startX, currentY - startY);
      } else if (drawShape === 'arrow') {
        drawArrow(oCtx, startX, startY, currentX, currentY);
      }
    });

    overlayCanvas.addEventListener('mouseup', async (e) => {
      if (!isDrawing) return;
      isDrawing = false;
      const endX = e.clientX;
      const endY = e.clientY;
      const centerX = (startX + endX) / 2;
      const centerY = (startY + endY) / 2;

      // Small hint from PDF:
      // "hide the drawing for a moment, find the element at its centre, and take the screenshot."
      container.style.display = 'none';

      // Find underlying DOM element
      const targetElement = document.elementFromPoint(centerX, centerY);
      const elementSelector = getElementSelector(targetElement);
      const elementSnippet = targetElement ? targetElement.outerHTML.substring(0, 300) : '<div></div>';

      // Capture screenshot if html2canvas available
      let screenshotDataUrl = '';
      if (window.html2canvas) {
        try {
          const canvas = await html2canvas(document.body, {
            x: Math.max(0, Math.min(startX, endX) - 40),
            y: Math.max(0, Math.min(startY, endY) - 40),
            width: Math.min(window.innerWidth, Math.abs(endX - startX) + 80),
            height: Math.min(window.innerHeight, Math.abs(endY - startY) + 80),
            logging: false
          });
          screenshotDataUrl = canvas.toDataURL('image/png');
        } catch (err) {
          console.warn('Screenshot error', err);
        }
      }

      container.style.display = 'block';
      showPromptDialog(elementSelector, elementSnippet, screenshotDataUrl);
    });
  }

  function drawArrow(ctx, fromX, fromY, toX, toY) {
    const headlen = 16;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fillStyle = '#ef4444';
    ctx.fill();
  }

  function getElementSelector(el) {
    if (!el || el === document.body) return 'body';
    let path = el.tagName.toLowerCase();
    if (el.id) return `#${el.id}`;
    if (el.className && typeof el.className === 'string') {
      const cls = el.className.trim().split(/\s+/).slice(0, 2).join('.');
      if (cls) path += `.${cls}`;
    }
    if (el.parentElement && el.parentElement !== document.body) {
      const parentTag = el.parentElement.tagName.toLowerCase();
      const parentCls = el.parentElement.className && typeof el.parentElement.className === 'string'
        ? `.${el.parentElement.className.trim().split(/\s+/)[0]}` : '';
      path = `${parentTag}${parentCls} > ${path}`;
    }
    return path;
  }

  // Floating AI Prompt Dialog
  function showPromptDialog(selector, snippet, screenshotDataUrl) {
    const existing = document.getElementById('ctf-prompt-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'ctf-prompt-modal';
    modal.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 1000000;
      width: 420px; background: #0f172a; border: 2px solid #ef4444; border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8); color: #fff; font-family: -apple-system, sans-serif;
      padding: 16px; display: flex; flex-direction: column; gap: 10px; font-size: 13px;
    `;

    modal.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="color:#f43f5e; font-size:14px;">⭕ Ready AI Agent Prompt</strong>
        <button id="ctfModalClose" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer;">&times;</button>
      </div>

      <div style="background:#1e293b; padding:8px 10px; border-radius:6px; font-size:11.5px; color:#94a3b8;">
        Target element: <code style="color:#38bdf8; font-weight:700;">${selector}</code>
      </div>

      <div>
        <label style="font-size:11px; color:#cbd5e1; font-weight:600;">What needs fixing? (Developer note):</label>
        <textarea id="ctfUserNote" rows="2" style="width:100%; background:#0b1120; border:1px solid #334155; color:#fff; border-radius:6px; padding:8px; font-size:12px; margin-top:4px;">Fix ${selector}: text overflows on phone. Screenshot attached.</textarea>
      </div>

      ${screenshotDataUrl ? `
        <div style="display:flex; align-items:center; gap:8px;">
          <img src="${screenshotDataUrl}" style="height:45px; border-radius:4px; border:1px solid #334155;">
          <span style="font-size:11px; color:#10b981;">✓ Screenshot captured locally</span>
        </div>
      ` : ''}

      <button id="ctfCopyPromptBtn" style="background:#10b981; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:700; cursor:pointer; font-size:13px;">
        Copy Prompt for AI Agent 📋
      </button>
      <div id="ctfCopySuccess" style="display:none; color:#34d399; font-size:11.5px; text-align:center; font-weight:600;">
        ✓ Prompt copied! Paste directly into your AI coding agent chat.
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('ctfModalClose').onclick = () => modal.remove();
    document.getElementById('ctfCopyPromptBtn').onclick = () => {
      const note = document.getElementById('ctfUserNote').value.trim();
      const fullPrompt = `${note}

Element Code:
\`\`\`html
${snippet}
\`\`\`

Target Selector: \`${selector}\`
(Reported via Circle to Fix Extension - 100% offline client-side)`;

      navigator.clipboard.writeText(fullPrompt).then(() => {
        document.getElementById('ctfCopySuccess').style.display = 'block';
        setTimeout(() => {
          modal.remove();
          removeOverlay();
        }, 1500);
      });
    };
  }
})();
