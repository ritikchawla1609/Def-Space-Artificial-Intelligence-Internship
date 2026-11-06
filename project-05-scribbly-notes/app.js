// Scribbly Notes — Hand-Drawn Notebook Generator
// Bharat Space Education Research Centre - GenAI Internship (Week 2, Project 5)

(function () {
  'use strict';

  // Constants & Canvas Page Dimensions (Standard A4 ratio: 794 x 1123 px at 96 DPI)
  const PAGE_WIDTH = 750;
  const PAGE_HEIGHT = 1050;
  const MARGIN_LEFT = 95;
  const MARGIN_RIGHT = 60;
  const MARGIN_TOP = 110;
  const MARGIN_BOTTOM = 80;
  const LINE_HEIGHT = 34; // Ruled lines grid height

  // State
  let currentFontStyle = 'architect';
  let currentInkColor = 'blue';
  let currentPaperStyle = 'ruled';
  let renderedCanvases = [];

  // Jitter configuration
  let jitterYMax = 1.8;
  let jitterRotMax = 1.4;
  let pressureVariance = 0.15;

  // DOM Elements
  const fontStyleSelect = document.getElementById('fontStyleSelect');
  const inkColorSelect = document.getElementById('inkColorSelect');
  const paperStyleSelect = document.getElementById('paperStyleSelect');
  const plainTextInput = document.getElementById('plainTextInput');
  const btnSaveImage = document.getElementById('btnSaveImage');
  const btnSavePdf = document.getElementById('btnSavePdf');
  const btnInsertSample = document.getElementById('btnInsertSample');
  const btnLoad3PageSample = document.getElementById('btnLoad3PageSample');
  const sliderJitterY = document.getElementById('sliderJitterY');
  const sliderJitterRot = document.getElementById('sliderJitterRot');
  const sliderPressure = document.getElementById('sliderPressure');
  const pagesScrollContainer = document.getElementById('pagesScrollContainer');
  const pageTotalCount = document.getElementById('pageTotalCount');
  const pageJumpBar = document.getElementById('pageJumpBar');

  // Ink Color Palette
  const INK_PALETTES = {
    blue: { base: 'rgb(29, 78, 216)', highlight: 'rgb(37, 99, 235)' },
    black: { base: 'rgb(24, 24, 27)', highlight: 'rgb(39, 39, 42)' },
    red: { base: 'rgb(220, 38, 38)', highlight: 'rgb(239, 68, 68)' },
    green: { base: 'rgb(4, 120, 87)', highlight: 'rgb(5, 150, 105)' }
  };

  // Font Stacks
  const FONT_CONFIGS = {
    architect: {
      family: '"Caveat", "Comic Sans MS", "Segoe Print", cursive, sans-serif',
      size: 24,
      weight: '600',
      letterSpacing: 0.5
    },
    cursive: {
      family: '"Brush Script MT", "Snell Roundhand", "Segoe Script", cursive',
      size: 26,
      weight: '500',
      letterSpacing: 0.2
    },
    neat: {
      family: '"Bradley Hand", "Chalkboard", "Segoe Print", sans-serif',
      size: 22,
      weight: '600',
      letterSpacing: 0.8
    }
  };

  const SAMPLE_OHMS_LAW = `Ohm's law:
V = IR !
current rises with voltage ->

Resistance (R) in Ohms opposes the flow of electrons.
In series circuits, R_total = R1 + R2 + R3.
In parallel circuits, 1/R_total = 1/R1 + 1/R2.

Key takeaway: Keep wires short to avoid internal resistance drops.`;

  const SAMPLE_3_PAGES = `=== CHAPTER 4: HEAT TRANSFER & CARNOT CYCLE ===

1. Introduction to Thermodynamic Systems
A thermodynamic system is a defined quantity of matter or region in space selected for study.
The surroundings are everything outside the system boundary.
Heat (Q) and Work (W) are path functions, while Internal Energy (U) is a state function.
According to the First Law of Thermodynamics:
dU = dQ - dW

2. The Carnot Heat Engine
The Carnot cycle is an ideal reversible cyclic process operating between two thermal reservoirs:
- Heat source at absolute temperature Th (Hot reservoir)
- Heat sink at absolute temperature Tc (Cold reservoir)

Cycle Stages:
Stage 1: Reversible Isothermal Expansion at Th. Gas absorbs heat Qh.
Stage 2: Reversible Adiabatic Expansion. Gas temperature drops from Th to Tc.
Stage 3: Reversible Isothermal Compression at Tc. Gas rejects heat Qc.
Stage 4: Reversible Adiabatic Compression. Gas returns to its initial state at Th.

Carnot Engine Efficiency (eta):
eta = 1 - (Tc / Th) = (Th - Tc) / Th

Notice that 100% efficiency is only possible if Tc = 0 Kelvin (Absolute Zero), which is unattainable by the Third Law.
Therefore, real internal combustion engines operate around 25% to 45% efficiency due to irreversible friction and thermal conduction losses.

=== PAGE 2: ENTROPY & SECOND LAW FORMULATIONS ===

3. Entropy and the Arrow of Time
Clausius Statement: Heat can never pass spontaneously from a colder body to a hotter body without external work input.
Kelvin-Planck Statement: It is impossible to construct an engine whose sole effect is the complete conversion of heat into mechanical work.

The Clausius Inequality states that for any cyclic process:
oint (dQ / T) <= 0
For a reversible process, the equality holds:
oint (dQ / T) = 0

This defines Entropy (S), where dS = dQ_rev / T.
In any irreversible spontaneous process, the total entropy of the universe increases:
Delta S_universe = Delta S_system + Delta S_surroundings > 0

4. Phase Transitions and Latent Heat
During phase changes (solid to liquid, liquid to vapor):
Temperature remains strictly constant while heat is absorbed to break intermolecular bonds.
Latent heat of fusion for water: Lf = 334 kJ/kg
Latent heat of vaporization for water: Lv = 2260 kJ/kg
Specific heat capacity of liquid water: c = 4.184 kJ/(kg*K)

=== PAGE 3: SUMMARY DIAGRAMS & EXAM FORMULAS ===

5. Rapid Revision Summary Formulas
- Work done in Isothermal Expansion: W = n*R*T * ln(V2 / V1)
- Work done in Adiabatic Process: W = (P1*V1 - P2*V2) / (gamma - 1)
- Adiabatic index: gamma = Cp / Cv
- For monoatomic ideal gas: gamma = 5/3 approx 1.67
- For diatomic ideal gas (Air): gamma = 7/5 = 1.40

6. Practical Tips for Engineering Exams:
- Always convert temperatures from Celsius to Kelvin: K = °C + 273.15!
- Double check pressure units: 1 atm = 101,325 Pascals (N/m^2).
- Volume in liters: 1 liter = 10^-3 m^3.

Good luck for the Semester Examination!
- Ritik & Student Study Circle`;

  function init() {
    setupEventListeners();
    plainTextInput.value = SAMPLE_OHMS_LAW;
    renderAllPages();
  }

  function setupEventListeners() {
    fontStyleSelect.addEventListener('change', (e) => {
      currentFontStyle = e.target.value;
      renderAllPages();
    });

    inkColorSelect.addEventListener('change', (e) => {
      currentInkColor = e.target.value;
      renderAllPages();
    });

    paperStyleSelect.addEventListener('change', (e) => {
      currentPaperStyle = e.target.value;
      renderAllPages();
    });

    plainTextInput.addEventListener('input', () => {
      renderAllPages();
    });

    sliderJitterY.addEventListener('input', (e) => {
      jitterYMax = parseFloat(e.target.value);
      renderAllPages();
    });
    sliderJitterRot.addEventListener('input', (e) => {
      jitterRotMax = parseFloat(e.target.value);
      renderAllPages();
    });
    sliderPressure.addEventListener('input', (e) => {
      pressureVariance = parseFloat(e.target.value);
      renderAllPages();
    });

    btnInsertSample.addEventListener('click', () => {
      plainTextInput.value = SAMPLE_OHMS_LAW;
      renderAllPages();
    });

    btnLoad3PageSample.addEventListener('click', () => {
      plainTextInput.value = SAMPLE_3_PAGES;
      renderAllPages();
    });

    btnSaveImage.addEventListener('click', handleSaveImage);
    btnSavePdf.addEventListener('click', handleSavePdf);
  }

  // --- RENDERING PIPELINE ---
  // Requirement: "A 3-page note splits with no line cut in half."
  function renderAllPages() {
    pagesScrollContainer.innerHTML = '';
    pageJumpBar.innerHTML = '';
    renderedCanvases = [];

    const text = plainTextInput.value || '';
    const paragraphs = text.split('\n');

    // Create a temporary measurement canvas
    const measureCanvas = document.createElement('canvas');
    const mCtx = measureCanvas.getContext('2d');
    const fontConfig = FONT_CONFIGS[currentFontStyle];
    mCtx.font = `${fontConfig.weight} ${fontConfig.size}px ${fontConfig.family}`;

    const maxLineWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    const maxPageContentHeight = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

    // 1. Break text into wrapped lines cleanly
    const wrappedLines = [];
    paragraphs.forEach(para => {
      if (para.trim() === '') {
        wrappedLines.push({ text: '', isBlank: true });
        return;
      }

      // Check if page break directive
      if (para.startsWith('=== PAGE')) {
        wrappedLines.push({ text: para, isBreak: true });
        return;
      }

      const words = para.split(' ');
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = mCtx.measureText(testLine).width;

        if (testWidth > maxLineWidth && currentLine !== '') {
          wrappedLines.push({ text: currentLine, isBlank: false });
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        wrappedLines.push({ text: currentLine, isBlank: false });
      }
    });

    // 2. Paginate lines without cutting in half
    const pages = [];
    let currentPageLines = [];
    let currentY = MARGIN_TOP;

    wrappedLines.forEach(lineObj => {
      if (lineObj.isBreak && currentPageLines.length > 0) {
        pages.push(currentPageLines);
        currentPageLines = [];
        currentY = MARGIN_TOP;
      }

      if (currentY + LINE_HEIGHT > PAGE_HEIGHT - MARGIN_BOTTOM) {
        pages.push(currentPageLines);
        currentPageLines = [];
        currentY = MARGIN_TOP;
      }

      currentPageLines.push(lineObj);
      currentY += LINE_HEIGHT;
    });

    if (currentPageLines.length > 0 || pages.length === 0) {
      pages.push(currentPageLines);
    }

    pageTotalCount.textContent = pages.length;

    // 3. Render each notebook page canvas
    pages.forEach((pageLines, pageIdx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'notebook-page-wrapper';
      wrapper.id = `notebookPage_${pageIdx + 1}`;

      const canvas = document.createElement('canvas');
      canvas.width = PAGE_WIDTH;
      canvas.height = PAGE_HEIGHT;
      canvas.className = 'page-canvas';
      wrapper.appendChild(canvas);
      pagesScrollContainer.appendChild(wrapper);

      renderSinglePage(canvas, pageLines, pageIdx + 1, pages.length);
      renderedCanvases.push(canvas);

      // Add jump pill
      const pill = document.createElement('button');
      pill.className = `page-jump-pill ${pageIdx === 0 ? 'active' : ''}`;
      pill.textContent = `Page ${pageIdx + 1}`;
      pill.addEventListener('click', () => {
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.page-jump-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
      pageJumpBar.appendChild(pill);
    });
  }

  // --- DRAW NOTEBOOK CANVAS ---
  function renderSinglePage(canvas, lines, pageNum, totalPageNum) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Paper Texture / Grid Background
    drawPaperBackground(ctx);

    // 2. Draw Page Header / Number
    ctx.save();
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Page ${pageNum} of ${totalPageNum}`, PAGE_WIDTH - 120, 45);
    ctx.fillText(`Date: 2026 / 11 / 05`, PAGE_WIDTH - 250, 45);
    ctx.restore();

    // 3. Draw Handwritten Content with Natural Variations
    const fontConfig = FONT_CONFIGS[currentFontStyle];
    const inkConfig = INK_PALETTES[currentInkColor];

    let lineY = MARGIN_TOP + 22; // Align above line baseline

    lines.forEach(lineObj => {
      if (lineObj.isBlank) {
        lineY += LINE_HEIGHT;
        return;
      }

      let currentX = MARGIN_LEFT;
      const words = lineObj.text.split(' ');

      words.forEach(word => {
        ctx.save();

        // Natural Human Jitter:
        // Baseline jitter (subtle Y bounce)
        const jitterY = (pseudoRandom() - 0.5) * (jitterYMax * 2);
        // Angle tilt jitter (subtle rotation)
        const jitterRot = (pseudoRandom() - 0.5) * (jitterRotMax * 0.035);
        // Pressure variance (subtle opacity and scale)
        const pressure = 1.0 - (pseudoRandom() * pressureVariance);

        ctx.translate(currentX, lineY + jitterY);
        ctx.rotate(jitterRot);

        ctx.font = `${fontConfig.weight} ${fontConfig.size}px ${fontConfig.family}`;
        ctx.fillStyle = inkConfig.base;
        ctx.globalAlpha = pressure;

        ctx.fillText(word, 0, 0);

        // Word flourish or arrow detection (e.g. -> or !)
        if (word === '->') {
          drawHandDrawnArrow(ctx, 0, 0, inkConfig.base);
        } else if (word.includes('!')) {
          // Subtle emphatic dot
          ctx.beginPath();
          ctx.arc(ctx.measureText(word).width + 3, -1, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        const wordWidth = ctx.measureText(word).width;
        ctx.restore();

        // Advance X with slight spacing jitter
        currentX += wordWidth + 10 + (pseudoRandom() - 0.5) * 3;
      });

      lineY += LINE_HEIGHT;
    });
  }

  // Draw Background Paper Styles
  function drawPaperBackground(ctx) {
    if (currentPaperStyle === 'sepia') {
      ctx.fillStyle = '#fef3c7'; // Warm sepia / parchment
      ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    } else {
      ctx.fillStyle = '#ffffff'; // Clean white
      ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    }

    if (currentPaperStyle === 'ruled' || currentPaperStyle === 'sepia') {
      // Classic Notebook: Left Red Margin Line
      ctx.strokeStyle = '#f87171'; // Red margin line
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(MARGIN_LEFT - 15, 0);
      ctx.lineTo(MARGIN_LEFT - 15, PAGE_HEIGHT);
      ctx.stroke();

      // Top Double Red Margin Header
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(PAGE_WIDTH, 70);
      ctx.moveTo(0, 74);
      ctx.lineTo(PAGE_WIDTH, 74);
      ctx.stroke();

      // Horizontal Blue Ruled Lines
      ctx.strokeStyle = currentPaperStyle === 'sepia' ? '#d1d5db' : '#93c5fd';
      ctx.lineWidth = 1.0;
      for (let y = MARGIN_TOP; y <= PAGE_HEIGHT - 40; y += LINE_HEIGHT) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(PAGE_WIDTH, y);
        ctx.stroke();
      }
    } else if (currentPaperStyle === 'grid') {
      // Engineering Graph Grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x <= PAGE_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, PAGE_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= PAGE_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(PAGE_WIDTH, y);
        ctx.stroke();
      }
    } else if (currentPaperStyle === 'dot') {
      // Modern Dot Grid
      ctx.fillStyle = '#94a3b8';
      const dotSpacing = 24;
      for (let x = MARGIN_LEFT - 20; x <= PAGE_WIDTH - MARGIN_RIGHT; x += dotSpacing) {
        for (let y = 60; y <= PAGE_HEIGHT - 40; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  function drawHandDrawnArrow(ctx, x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 5);
    ctx.lineTo(x + 15, y - 5);
    ctx.lineTo(x + 8, y - 10);
    ctx.moveTo(x + 15, y - 5);
    ctx.lineTo(x + 8, y);
    ctx.stroke();
  }

  // Reproducible pseudo-random number generator for consistent natural look
  let seed = 42;
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // --- EXPORT PNG IMAGE ---
  function handleSaveImage() {
    if (renderedCanvases.length === 0) return;
    const firstCanvas = renderedCanvases[0];
    const dataUrl = firstCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `scribbly-notes-page1-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // --- EXPORT MULTI-PAGE PDF ---
  async function handleSavePdf() {
    if (renderedCanvases.length === 0) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [PAGE_WIDTH, PAGE_HEIGHT]
    });

    renderedCanvases.forEach((canvas, idx) => {
      if (idx > 0) doc.addPage([PAGE_WIDTH, PAGE_HEIGHT], 'portrait');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      doc.addImage(imgData, 'JPEG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    });

    doc.save(`scribbly-notes-${Date.now()}.pdf`);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
