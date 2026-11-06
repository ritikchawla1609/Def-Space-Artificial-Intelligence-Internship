// Form Photo Fixer — Offline Exam & Job Application Photo/Sign Tool
// Bharat Space Education Research Centre - GenAI Internship (Week 2, Project 2)

(function () {
  'use strict';

  // Preset Configurations
  const PRESETS = {
    upsc: {
      name: 'UPSC Civil Services',
      photo: { width: 350, height: 450, cm: '3.5 × 4.5 cm', maxKb: 50, minKb: 20, notes: 'Face must occupy 75% of area. Plain white/light background.' },
      signature: { width: 350, height: 150, cm: '3.5 × 1.5 cm', maxKb: 20, minKb: 10, notes: 'Black ink on unruled white paper.' }
    },
    ssc: {
      name: 'SSC CGL / CHSL',
      photo: { width: 350, height: 450, cm: '3.5 × 4.5 cm', maxKb: 50, minKb: 20, notes: 'Recent photograph without cap and spectacles.' },
      signature: { width: 400, height: 200, cm: '4.0 × 2.0 cm', maxKb: 20, minKb: 10, notes: 'Sign clearly inside specified rectangular box.' }
    },
    gate: {
      name: 'GATE / IIT',
      photo: { width: 480, height: 640, cm: '3.5 × 4.5 cm', maxKb: 200, minKb: 20, notes: 'Aspect ratio 0.75, forehead, eyes, nose & chin clearly visible.' },
      signature: { width: 560, height: 160, cm: '7.0 × 2.0 cm', maxKb: 100, minKb: 5, notes: 'Dark blue or black ink signature only.' }
    },
    ibps: {
      name: 'IBPS Bank PO / Clerk',
      photo: { width: 350, height: 450, cm: '3.5 × 4.5 cm', maxKb: 50, minKb: 20, notes: 'Dimensions 200 x 230 px min, 50 KB max.' },
      signature: { width: 350, height: 150, cm: '3.5 × 1.5 cm', maxKb: 20, minKb: 10, notes: 'Applicant signature in running handwriting.' }
    },
    passport: {
      name: 'Indian Passport / US Visa',
      photo: { width: 500, height: 500, cm: '5.0 × 5.0 cm', maxKb: 100, minKb: 30, notes: 'Square passport size (2x2 inches), white background.' },
      signature: { width: 450, height: 180, cm: '4.5 × 1.8 cm', maxKb: 30, minKb: 10, notes: 'Sign with ballpoint or gel pen.' }
    }
  };

  // State
  let currentPresetKey = 'upsc';
  let currentMode = 'photo'; // 'photo' | 'signature'
  let loadedImage = null;
  let customPresets = JSON.parse(localStorage.getItem('formPhoto_customPresets') || '{}');

  // Canvas Transform State
  let scale = 1.0;
  let posX = 0, posY = 0;
  let rotation = 0; // degrees
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;

  // Processed Output Blob State
  let finalBlob = null;
  let finalQuality = 0.92;
  let finalKb = 0;

  // DOM Elements
  const formPresetSelect = document.getElementById('formPresetSelect');
  const tabPhotoBtn = document.getElementById('tabPhotoBtn');
  const tabSignBtn = document.getElementById('tabSignBtn');
  const specFormName = document.getElementById('specFormName');
  const specDimensions = document.getElementById('specDimensions');
  const specMaxKb = document.getElementById('specMaxKb');
  const specNotes = document.getElementById('specNotes');
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const zoomSlider = document.getElementById('zoomSlider');
  const btnRotateLeft = document.getElementById('btnRotateLeft');
  const btnRotateRight = document.getElementById('btnRotateRight');
  const btnResetView = document.getElementById('btnResetView');
  const chkFaceGuide = document.getElementById('chkFaceGuide');
  const faceGuideSvg = document.getElementById('faceGuideSvg');
  const canvasFrame = document.getElementById('canvasFrame');
  const cropCanvas = document.getElementById('cropCanvas');
  const ctx = cropCanvas.getContext('2d');
  const meterReadingText = document.getElementById('meterReadingText');
  const readyBadge = document.getElementById('readyBadge');
  const meterProgressFill = document.getElementById('meterProgressFill');
  const outputDimsText = document.getElementById('outputDimsText');
  const downloadBtnLabel = document.getElementById('downloadBtnLabel');
  const btnDownload = document.getElementById('btnDownload');
  const btnLoadSample = document.getElementById('btnLoadSample');

  // Custom Preset Modal Elements
  const customPresetModal = document.getElementById('customPresetModal');
  const btnClosePresetModal = document.getElementById('btnClosePresetModal');
  const btnCancelCustom = document.getElementById('btnCancelCustom');
  const btnSaveCustom = document.getElementById('btnSaveCustom');

  function init() {
    setupEventListeners();
    updatePresetUI();
    loadSampleData(); // Load default demo candidate photo
  }

  function setupEventListeners() {
    formPresetSelect.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        openCustomPresetModal();
      } else {
        currentPresetKey = e.target.value;
        updatePresetUI();
        processAndRender();
      }
    });

    tabPhotoBtn.addEventListener('click', () => switchMode('photo'));
    tabSignBtn.addEventListener('click', () => switchMode('signature'));

    fileInput.addEventListener('change', handleFileSelect);
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadImageFromFile(e.dataTransfer.files[0]);
      }
    });

    zoomSlider.addEventListener('input', (e) => {
      scale = parseFloat(e.target.value);
      renderCanvas();
      recalculateCompression();
    });

    btnRotateLeft.addEventListener('click', () => {
      rotation = (rotation - 90) % 360;
      renderCanvas();
      recalculateCompression();
    });
    btnRotateRight.addEventListener('click', () => {
      rotation = (rotation + 90) % 360;
      renderCanvas();
      recalculateCompression();
    });
    btnResetView.addEventListener('click', resetTransforms);

    chkFaceGuide.addEventListener('change', (e) => {
      faceGuideSvg.style.display = (e.target.checked && currentMode === 'photo') ? 'block' : 'none';
    });

    // Canvas Pan Events
    canvasFrame.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvasFrame.addEventListener('wheel', handleMouseWheel, { passive: false });

    // Touch support for phone browser testing
    canvasFrame.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    btnDownload.addEventListener('click', handleDownload);
    btnLoadSample.addEventListener('click', loadSampleData);

    // Custom Modal
    btnClosePresetModal.addEventListener('click', closeCustomPresetModal);
    btnCancelCustom.addEventListener('click', closeCustomPresetModal);
    btnSaveCustom.addEventListener('click', handleSaveCustomPreset);
  }

  function getActiveConfig() {
    const preset = PRESETS[currentPresetKey] || customPresets[currentPresetKey];
    return preset[currentMode];
  }

  function updatePresetUI() {
    const preset = PRESETS[currentPresetKey] || customPresets[currentPresetKey] || PRESETS.upsc;
    const config = preset[currentMode];

    specFormName.textContent = preset.name;
    specDimensions.textContent = `${config.cm} (${config.width} × ${config.height} px)`;
    specMaxKb.textContent = `${config.maxKb} KB`;
    specNotes.textContent = config.notes;

    outputDimsText.textContent = `${config.width} × ${config.height} px`;
    downloadBtnLabel.textContent = currentMode === 'photo' ? 'Photo' : 'Signature';

    // Resize canvas viewport frame to match target aspect ratio
    canvasFrame.style.width = `${config.width}px`;
    canvasFrame.style.height = `${config.height}px`;
    cropCanvas.width = config.width;
    cropCanvas.height = config.height;

    // Toggle face guide visibility
    faceGuideSvg.style.display = (currentMode === 'photo' && chkFaceGuide.checked) ? 'block' : 'none';
  }

  function switchMode(mode) {
    currentMode = mode;
    tabPhotoBtn.classList.toggle('active', mode === 'photo');
    tabSignBtn.classList.toggle('active', mode === 'signature');
    updatePresetUI();
    loadSampleData();
  }

  // File Handling
  function handleFileSelect(e) {
    if (e.target.files && e.target.files[0]) {
      loadImageFromFile(e.target.files[0]);
    }
  }

  function loadImageFromFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        loadedImage = img;
        resetTransforms();
        processAndRender();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function resetTransforms() {
    if (!loadedImage) return;
    const config = getActiveConfig();
    const scaleX = config.width / loadedImage.width;
    const scaleY = config.height / loadedImage.height;
    scale = Math.max(scaleX, scaleY);
    posX = (config.width - loadedImage.width * scale) / 2;
    posY = (config.height - loadedImage.height * scale) / 2;
    rotation = 0;
    zoomSlider.value = scale;
    renderCanvas();
    recalculateCompression();
  }

  // Canvas Mouse & Touch Interaction
  function handleMouseDown(e) {
    isDragging = true;
    dragStartX = e.clientX - posX;
    dragStartY = e.clientY - posY;
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    posX = e.clientX - dragStartX;
    posY = e.clientY - dragStartY;
    renderCanvas();
  }

  function handleMouseUp() {
    if (isDragging) {
      isDragging = false;
      recalculateCompression();
    }
  }

  function handleMouseWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
    scale = Math.max(0.2, Math.min(4.0, scale * zoomFactor));
    zoomSlider.value = scale;
    renderCanvas();
    recalculateCompression();
  }

  // Touch handlers with multi-touch pinch-to-zoom
  let touchStartDist = 0;
  let touchStartScale = 1.0;

  function getTouchDistance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX - posX;
      dragStartY = e.touches[0].clientY - posY;
    } else if (e.touches.length === 2) {
      isDragging = false;
      touchStartDist = getTouchDistance(e.touches[0], e.touches[1]);
      touchStartScale = scale;
    }
  }

  function handleTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      posX = e.touches[0].clientX - dragStartX;
      posY = e.touches[0].clientY - dragStartY;
      renderCanvas();
    } else if (e.touches.length === 2 && touchStartDist > 0) {
      e.preventDefault();
      const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
      const pinchFactor = currentDist / touchStartDist;
      scale = Math.max(0.2, Math.min(4.0, touchStartScale * pinchFactor));
      zoomSlider.value = scale;
      renderCanvas();
    }
  }

  function handleTouchEnd(e) {
    if (!e.touches || e.touches.length === 0) {
      isDragging = false;
      touchStartDist = 0;
      recalculateCompression();
    } else if (e.touches.length === 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX - posX;
      dragStartY = e.touches[0].clientY - posY;
    }
  }

  // Render Canvas
  function renderCanvas() {
    const config = getActiveConfig();
    ctx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);

    // Default white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);

    if (!loadedImage) return;

    ctx.save();
    ctx.translate(posX + (loadedImage.width * scale) / 2, posY + (loadedImage.height * scale) / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      loadedImage,
      -(loadedImage.width * scale) / 2,
      -(loadedImage.height * scale) / 2,
      loadedImage.width * scale,
      loadedImage.height * scale
    );
    ctx.restore();
  }

  // --- BINARY SEARCH COMPRESSION ENGINE ---
  // Requirement: "Compress to just under the KB limit."
  // Hint: "lower the image quality step by step until the file is just under the limit."
  async function recalculateCompression() {
    const config = getActiveConfig();
    const maxBytes = config.maxKb * 1024;
    const minBytes = (config.minKb || 10) * 1024;

    // Binary search on quality parameter [0.05, 0.98]
    let low = 0.05;
    let high = 0.98;
    let bestBlob = null;
    let bestQuality = 0.9;

    for (let iter = 0; iter < 10; iter++) {
      const mid = (low + high) / 2;
      const blob = await canvasToBlob(cropCanvas, 'image/jpeg', mid);
      if (blob.size <= maxBytes) {
        bestBlob = blob;
        bestQuality = mid;
        low = mid; // Try higher quality
      } else {
        high = mid; // Too large, lower quality
      }
    }

    if (!bestBlob) {
      // If even lowest quality exceeds maxKB, downsample canvas resolution slightly
      bestBlob = await canvasToBlob(cropCanvas, 'image/jpeg', 0.05);
      bestQuality = 0.05;
    }

    finalBlob = bestBlob;
    finalQuality = bestQuality;
    finalKb = parseFloat((finalBlob.size / 1024).toFixed(1));

    updateMeterUI(finalKb, config.maxKb);
  }

  function canvasToBlob(canvas, mimeType, quality) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), mimeType, quality);
    });
  }

  function updateMeterUI(sizeKb, limitKb) {
    meterReadingText.innerHTML = `<strong>${sizeKb} KB</strong> of ${limitKb} KB limit`;
    const percentage = Math.min(100, Math.round((sizeKb / limitKb) * 100));
    meterProgressFill.style.width = `${percentage}%`;

    if (sizeKb <= limitKb) {
      readyBadge.textContent = '✓ Ready to upload';
      readyBadge.style.color = '#10b981';
      meterProgressFill.className = 'meter-progress-fill';
    } else {
      readyBadge.textContent = '⚠ Over Limit';
      readyBadge.style.color = '#ef4444';
      meterProgressFill.className = 'meter-progress-fill danger';
    }
  }

  async function processAndRender() {
    renderCanvas();
    await recalculateCompression();
  }

  // Download Handler
  function handleDownload() {
    if (!finalBlob) return;
    const config = getActiveConfig();
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPresetKey}_${currentMode}_${config.width}x${config.height}_${Math.round(finalKb)}kb.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Demo Sample Generator
  function loadSampleData() {
    const config = getActiveConfig();
    const demoCanvas = document.createElement('canvas');
    demoCanvas.width = 700;
    demoCanvas.height = currentMode === 'photo' ? 900 : 300;
    const dCtx = demoCanvas.getContext('2d');

    if (currentMode === 'photo') {
      // Draw pleasant demo applicant portrait
      dCtx.fillStyle = '#ffffff'; // White background
      dCtx.fillRect(0, 0, demoCanvas.width, demoCanvas.height);

      // Shirt / shoulders
      dCtx.fillStyle = '#1e3a8a';
      dCtx.beginPath();
      dCtx.ellipse(350, 850, 260, 160, 0, 0, Math.PI * 2);
      dCtx.fill();

      // Neck
      dCtx.fillStyle = '#f5cda7';
      dCtx.fillRect(310, 520, 80, 120);

      // Head / Face
      dCtx.fillStyle = '#fcd9b8';
      dCtx.beginPath();
      dCtx.ellipse(350, 420, 150, 190, 0, 0, Math.PI * 2);
      dCtx.fill();

      // Hair
      dCtx.fillStyle = '#1e1e24';
      dCtx.beginPath();
      dCtx.ellipse(350, 310, 160, 120, 0, Math.PI, Math.PI * 2);
      dCtx.fill();

      // Eyes
      dCtx.fillStyle = '#374151';
      dCtx.beginPath();
      dCtx.ellipse(290, 400, 14, 8, 0, 0, Math.PI * 2);
      dCtx.ellipse(410, 400, 14, 8, 0, 0, Math.PI * 2);
      dCtx.fill();

      // Smile
      dCtx.strokeStyle = '#991b1b';
      dCtx.lineWidth = 4;
      dCtx.beginPath();
      dCtx.arc(350, 470, 35, 0.2, Math.PI - 0.2);
      dCtx.stroke();
    } else {
      // Signature Demo
      dCtx.fillStyle = '#ffffff';
      dCtx.fillRect(0, 0, demoCanvas.width, demoCanvas.height);

      dCtx.strokeStyle = '#1e293b';
      dCtx.lineWidth = 6;
      dCtx.lineCap = 'round';
      dCtx.lineJoin = 'round';

      dCtx.beginPath();
      dCtx.moveTo(100, 180);
      dCtx.bezierCurveTo(150, 70, 200, 80, 220, 190);
      dCtx.bezierCurveTo(240, 160, 270, 150, 320, 180);
      dCtx.bezierCurveTo(360, 130, 400, 120, 450, 175);
      dCtx.bezierCurveTo(490, 140, 530, 130, 580, 170);
      dCtx.stroke();

      // Underline flourish
      dCtx.beginPath();
      dCtx.moveTo(110, 210);
      dCtx.lineTo(600, 210);
      dCtx.stroke();
    }

    const img = new Image();
    img.onload = () => {
      loadedImage = img;
      resetTransforms();
      processAndRender();
    };
    img.src = demoCanvas.toDataURL('image/jpeg', 0.95);
  }

  // Custom Preset Modal Handling
  function openCustomPresetModal() {
    customPresetModal.style.display = 'flex';
  }

  function closeCustomPresetModal() {
    customPresetModal.style.display = 'none';
    formPresetSelect.value = currentPresetKey;
  }

  function handleSaveCustomPreset() {
    const name = document.getElementById('custName').value.trim() || 'Custom Preset';
    const width = parseInt(document.getElementById('custWidth').value) || 350;
    const height = parseInt(document.getElementById('custHeight').value) || 450;
    const maxKb = parseInt(document.getElementById('custMaxKb').value) || 50;

    const key = `custom_${Date.now()}`;
    customPresets[key] = {
      name: name,
      photo: { width, height, cm: 'Custom Size', maxKb, minKb: 10, notes: 'User-configured custom exam specifications.' },
      signature: { width: Math.round(width * 0.9), height: Math.round(height * 0.4), cm: 'Custom Sign', maxKb: Math.round(maxKb * 0.4), minKb: 5, notes: 'Custom signature size' }
    };

    localStorage.setItem('formPhoto_customPresets', JSON.stringify(customPresets));

    // Add option to dropdown
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `${name} (${width}×${height}px ≤${maxKb}KB)`;
    formPresetSelect.insertBefore(opt, formPresetSelect.lastElementChild);

    currentPresetKey = key;
    formPresetSelect.value = key;
    closeCustomPresetModal();
    updatePresetUI();
    processAndRender();
  }

  window.addEventListener('DOMContentLoaded', init);
})();
