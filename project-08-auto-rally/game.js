// Auto Rally — 3D Auto-Rickshaw Racing Game
// Bharat Space Education Research Centre - GenAI Internship (Week 2, Project 8)

(function () {
  'use strict';

  // Canvas & Context
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // DOM HUD Elements
  const hudCoinCount = document.getElementById('hudCoinCount');
  const hudLapText = document.getElementById('hudLapText');
  const hudTimerText = document.getElementById('hudTimerText');
  const hudBestTime = document.getElementById('hudBestTime');
  const btnSoundToggle = document.getElementById('btnSoundToggle');

  // Overlays
  const startOverlay = document.getElementById('startOverlay');
  const victoryOverlay = document.getElementById('victoryOverlay');
  const btnStartGame = document.getElementById('btnStartGame');
  const btnPlayAgain = document.getElementById('btnPlayAgain');
  const vicTotalTime = document.getElementById('vicTotalTime');
  const vicNewBestBadge = document.getElementById('vicNewBestBadge');
  const splitLap1 = document.getElementById('splitLap1');
  const splitLap2 = document.getElementById('splitLap2');
  const splitLap3 = document.getElementById('splitLap3');
  const vicCoinsCollected = document.getElementById('vicCoinsCollected');

  // Touch buttons
  const btnTouchLeft = document.getElementById('btnTouchLeft');
  const btnTouchRight = document.getElementById('btnTouchRight');
  const btnTouchGas = document.getElementById('btnTouchGas');
  const btnTouchNitro = document.getElementById('btnTouchNitro');
  const btnTouchHonk = document.getElementById('btnTouchHonk');

  // Game Engine Constants
  const FPS = 60;
  const ROAD_WIDTH = 1200;
  const SEGMENT_LENGTH = 150;
  const TOTAL_SEGMENTS = 400; // Track length
  const TOTAL_LAPS = 3;

  // Game State
  let isPlaying = false;
  let isMuted = false;
  let playerX = 0; // -1 (left edge) to 1 (right edge)
  let playerZ = 0; // Position along track
  let speed = 0;
  const maxSpeed = 12000;
  const accel = 180;
  const braking = -300;
  const decel = -80;

  let currentLap = 1;
  let lapStartTime = 0;
  let raceStartTime = 0;
  let lapTimes = [];
  let coinsCount = 0;
  let nitroTimeLeft = 0;
  let bestRaceTime = parseFloat(localStorage.getItem('autoRally_bestTime') || '0');

  // Road geometry segments
  let segments = [];
  // Entities on track (Coins, Cows, Potholes, Buses)
  let trackEntities = [];

  // Input state
  const keys = {
    left: false,
    right: false,
    up: false,
    down: false
  };

  // --- WEB AUDIO API SYNTHESIZER ---
  let audioCtx = null;
  let engineOsc = null;
  let engineGain = null;

  function initAudio() {
    if (!audioCtx) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Continuous engine oscillator
        engineOsc = audioCtx.createOscillator();
        engineGain = audioCtx.createGain();
        engineOsc.type = 'sawtooth';
        engineOsc.frequency.setValueAtTime(55, audioCtx.currentTime);
        engineGain.gain.setValueAtTime(0, audioCtx.currentTime);
        engineOsc.connect(engineGain);
        engineGain.connect(audioCtx.destination);
        engineOsc.start();
      } catch (e) {
        console.warn('Web Audio not supported', e);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  function playSound(type) {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      if (type === 'coin') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12); // E6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'horn') {
        // Indian Desi Auto Horn "Pom Pom!"
        [440, 554].forEach(freq => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
        });
      } else if (type === 'crash') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'nitro') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {}
  }

  function updateEngineAudio() {
    if (!engineGain || !audioCtx) return;
    if (isMuted || !isPlaying) {
      engineGain.gain.setValueAtTime(0, audioCtx.currentTime);
      return;
    }
    const currentSpeedRatio = speed / maxSpeed;
    const targetFreq = 45 + currentSpeedRatio * 85 + (nitroTimeLeft > 0 ? 40 : 0);
    engineOsc.frequency.setValueAtTime(targetFreq, audioCtx.currentTime);
    engineGain.gain.setValueAtTime(0.08 + currentSpeedRatio * 0.08, audioCtx.currentTime);
  }

  // --- INITIALIZATION ---
  function init() {
    setupInputListeners();
    buildTrack();
    displayBestTime();
    requestAnimationFrame(gameLoop);
  }

  function displayBestTime() {
    if (bestRaceTime > 0) {
      hudBestTime.textContent = formatTime(bestRaceTime);
    } else {
      hudBestTime.textContent = '--:--';
    }
  }

  // Build Procedural Looping Track
  function buildTrack() {
    segments = [];
    trackEntities = [];

    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
      // Procedural curves and hills
      let curve = 0;
      if (i > 50 && i < 110) curve = 2.4;
      else if (i > 150 && i < 210) curve = -2.8;
      else if (i > 270 && i < 330) curve = 3.2;

      let hill = 0;
      if (i > 80 && i < 140) hill = Math.sin((i - 80) * 0.05) * 800;

      segments.push({
        index: i,
        p1: { world: { z: i * SEGMENT_LENGTH, y: hill }, camera: {}, screen: {} },
        p2: { world: { z: (i + 1) * SEGMENT_LENGTH, y: hill }, camera: {}, screen: {} },
        curve: curve,
        color: (Math.floor(i / 3) % 2) ? { grass: '#15803d', road: '#334155', rumble: '#ef4444', lane: '#ffffff' }
                                      : { grass: '#16a34a', road: '#1e293b', rumble: '#ffffff', lane: '#1e293b' }
      });

      // Scatter Coins, Potholes, Cows, and Chai Power-ups
      if (i > 15 && i % 12 === 0) {
        trackEntities.push({
          type: 'coin',
          segmentIndex: i,
          x: (Math.sin(i * 99) * 0.7),
          collected: false
        });
      }

      if (i > 30 && i % 45 === 0) {
        trackEntities.push({
          type: 'cow',
          segmentIndex: i,
          x: (Math.cos(i) * 0.5),
          honked: false
        });
      }

      if (i > 20 && i % 38 === 0) {
        trackEntities.push({
          type: 'pothole',
          segmentIndex: i,
          x: (Math.sin(i * 13) * 0.6)
        });
      }

      if (i === 60 || i === 180 || i === 300) {
        trackEntities.push({
          type: 'chai',
          segmentIndex: i,
          x: 0,
          collected: false
        });
      }
    }
  }

  // --- INPUT CONTROLS ---
  function setupInputListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      initAudio();
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
      if (e.key === ' ' || e.key === 'b' || e.key === 'B') handleHonk();
      if (e.key === 'Shift') triggerNitro();
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
    });

    // Touch Button Events
    bindTouch(btnTouchLeft, (active) => { keys.left = active; });
    bindTouch(btnTouchRight, (active) => { keys.right = active; });
    bindTouch(btnTouchGas, (active) => { keys.up = active; });
    btnTouchHonk.addEventListener('click', handleHonk);
    btnTouchNitro.addEventListener('click', triggerNitro);

    btnSoundToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      btnSoundToggle.textContent = isMuted ? '🔇' : '🔊';
    });

    btnStartGame.addEventListener('click', startRace);
    btnPlayAgain.addEventListener('click', startRace);
  }

  function bindTouch(element, callback) {
    const start = (e) => { e.preventDefault(); initAudio(); callback(true); };
    const end = (e) => { e.preventDefault(); callback(false); };
    element.addEventListener('touchstart', start, { passive: false });
    element.addEventListener('touchend', end, { passive: false });
    element.addEventListener('touchcancel', end, { passive: false });
    element.addEventListener('mousedown', () => { initAudio(); callback(true); });
    element.addEventListener('mouseleave', () => callback(false));
    window.addEventListener('mouseup', () => callback(false));
  }

  function handleHonk() {
    playSound('horn');
    // Scares away nearby cows!
    const playerSeg = Math.floor(playerZ / SEGMENT_LENGTH) % TOTAL_SEGMENTS;
    trackEntities.forEach(ent => {
      if (ent.type === 'cow' && Math.abs(ent.segmentIndex - playerSeg) < 15) {
        ent.x = ent.x > 0 ? 1.4 : -1.4; // Cow jumps off road!
      }
    });
  }

  function triggerNitro() {
    if (nitroTimeLeft <= 0 && coinsCount >= 3) {
      coinsCount -= 3;
      nitroTimeLeft = 4.0; // 4 seconds of nitro
      hudCoinCount.textContent = coinsCount;
      playSound('nitro');
    }
  }

  function startRace() {
    initAudio();
    startOverlay.style.display = 'none';
    victoryOverlay.style.display = 'none';

    isPlaying = true;
    currentLap = 1;
    playerX = 0;
    playerZ = 0;
    speed = 0;
    coinsCount = 0;
    nitroTimeLeft = 0;
    lapTimes = [];
    raceStartTime = performance.now();
    lapStartTime = raceStartTime;

    buildTrack();
    hudCoinCount.textContent = '0';
    hudLapText.textContent = `Lap 1/${TOTAL_LAPS}`;
  }

  // --- MAIN LOOP ---
  function gameLoop(timestamp) {
    update(1 / FPS);
    render();
    requestAnimationFrame(gameLoop);
  }

  // --- PHYSICS & LOGIC UPDATE ---
  function update(dt) {
    if (!isPlaying) return;

    // Handle Speed
    const currentMaxSpeed = nitroTimeLeft > 0 ? maxSpeed * 1.4 : maxSpeed;

    if (keys.up) {
      speed = Math.min(currentMaxSpeed, speed + accel);
    } else if (keys.down) {
      speed = Math.max(0, speed + braking);
    } else {
      speed = Math.max(0, speed + decel);
    }

    if (nitroTimeLeft > 0) {
      nitroTimeLeft -= dt;
    }

    // Steering
    const speedRatio = speed / maxSpeed;
    if (keys.left) playerX -= 1.8 * dt * (speedRatio > 0.1 ? 1 : 0.4);
    if (keys.right) playerX += 1.8 * dt * (speedRatio > 0.1 ? 1 : 0.4);

    // Centrifugal drift on curves
    const playerSegmentIndex = Math.floor(playerZ / SEGMENT_LENGTH) % TOTAL_SEGMENTS;
    const currentSegment = segments[playerSegmentIndex];
    playerX -= (currentSegment.curve * speedRatio * dt * 0.05);

    // Advance position
    playerZ += speed * dt;

    // Check Lap Completion
    const trackTotalLength = TOTAL_SEGMENTS * SEGMENT_LENGTH;
    if (playerZ >= trackTotalLength) {
      playerZ -= trackTotalLength;
      const now = performance.now();
      const thisLapDuration = (now - lapStartTime) / 1000;
      lapTimes.push(thisLapDuration);
      lapStartTime = now;

      if (currentLap < TOTAL_LAPS) {
        currentLap++;
        hudLapText.textContent = `Lap ${currentLap}/${TOTAL_LAPS}`;
      } else {
        finishRace();
      }
    }

    // Collision Detection with Entities
    trackEntities.forEach(ent => {
      if (ent.collected) return;
      const distZ = Math.abs((ent.segmentIndex * SEGMENT_LENGTH) - playerZ);

      if (distZ < SEGMENT_LENGTH * 0.8) {
        const distX = Math.abs(ent.x - playerX);

        if (distX < 0.28) {
          if (ent.type === 'coin') {
            ent.collected = true;
            coinsCount++;
            hudCoinCount.textContent = coinsCount;
            playSound('coin');
          } else if (ent.type === 'chai') {
            ent.collected = true;
            nitroTimeLeft = 5.0; // 5s free nitro boost!
            playSound('nitro');
          } else if (ent.type === 'cow' || ent.type === 'pothole') {
            // Collision!
            speed = speed * 0.4;
            playSound('crash');
            // Slight visual shake
            playerX += (playerX > 0 ? -0.15 : 0.15);
          }
        }
      }
    });

    // Update Timer HUD
    const elapsedSeconds = (performance.now() - raceStartTime) / 1000;
    hudTimerText.textContent = formatTime(elapsedSeconds);

    updateEngineAudio();
  }

  function finishRace() {
    isPlaying = false;
    const totalDuration = (performance.now() - raceStartTime) / 1000;

    vicTotalTime.textContent = formatTime(totalDuration);
    splitLap1.textContent = formatTime(lapTimes[0] || 0);
    splitLap2.textContent = formatTime(lapTimes[1] || 0);
    splitLap3.textContent = formatTime(lapTimes[2] || 0);
    vicCoinsCollected.textContent = coinsCount;

    // Save Track Record
    if (bestRaceTime === 0 || totalDuration < bestRaceTime) {
      bestRaceTime = totalDuration;
      localStorage.setItem('autoRally_bestTime', bestRaceTime.toString());
      vicNewBestBadge.style.display = 'block';
    } else {
      vicNewBestBadge.style.display = 'none';
    }

    displayBestTime();
    victoryOverlay.style.display = 'flex';
  }

  // --- RENDERING PIPELINE ---
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Sunset Sky & Sun (Matching PDF Page 10 screenshot)
    drawSkyAndHorizon();

    // 2. Render Perspective 3D Road
    const baseSegmentIndex = Math.floor(playerZ / SEGMENT_LENGTH) % TOTAL_SEGMENTS;
    const baseSegment = segments[baseSegmentIndex];

    const cameraHeight = 1000;
    const cameraDepth = 0.84;
    const drawDistance = 140;

    let maxy = canvas.height;
    let x = 0;
    let dx = -(baseSegment.curve * (playerZ % SEGMENT_LENGTH) / SEGMENT_LENGTH);

    for (let n = 0; n < drawDistance; n++) {
      const segIndex = (baseSegmentIndex + n) % TOTAL_SEGMENTS;
      const segment = segments[segIndex];
      const looped = segIndex < baseSegmentIndex;

      // Project segment vertices to screen
      project(segment.p1, (playerX * ROAD_WIDTH) - x, cameraHeight, (playerZ % (TOTAL_SEGMENTS * SEGMENT_LENGTH)) - (looped ? TOTAL_SEGMENTS * SEGMENT_LENGTH : 0), cameraDepth, canvas.width, canvas.height, ROAD_WIDTH);
      project(segment.p2, (playerX * ROAD_WIDTH) - x - dx, cameraHeight, (playerZ % (TOTAL_SEGMENTS * SEGMENT_LENGTH)) - (looped ? TOTAL_SEGMENTS * SEGMENT_LENGTH : 0), cameraDepth, canvas.width, canvas.height, ROAD_WIDTH);

      x += dx;
      dx += segment.curve;

      if (segment.p1.camera.z <= cameraDepth || segment.p2.screen.y >= maxy) continue;

      renderSegmentPolygon(
        ctx,
        canvas.width,
        segment.p1.screen.y,
        segment.p1.screen.x,
        segment.p1.screen.w,
        segment.p2.screen.y,
        segment.p2.screen.x,
        segment.p2.screen.w,
        segment.color
      );

      maxy = segment.p2.screen.y;
    }

    // 3. Render Track Entities (Coins, Chai, Cows, Potholes)
    for (let n = drawDistance - 1; n > 0; n--) {
      const segIndex = (baseSegmentIndex + n) % TOTAL_SEGMENTS;
      const segment = segments[segIndex];

      trackEntities.forEach(ent => {
        if (ent.segmentIndex === segIndex && !ent.collected) {
          const spriteX = segment.p1.screen.x + (segment.p1.screen.w * ent.x);
          const spriteY = segment.p1.screen.y;
          const spriteScale = segment.p1.screen.w / 400;

          if (spriteScale > 0.05 && spriteScale < 2.5) {
            drawEntitySprite(ctx, ent.type, spriteX, spriteY, spriteScale);
          }
        }
      });
    }

    // 4. Render Player Auto-Rickshaw
    drawPlayerAutoRickshaw();

    // 5. Nitro Visual Speed Lines Overlay
    if (nitroTimeLeft > 0) {
      drawNitroSpeedLines();
    }
  }

  // 3D Projection Math
  function project(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = p.world.z - cameraZ;
    p.screen.scale = cameraDepth / p.camera.z;
    p.screen.x = Math.round((width / 2) + (p.screen.scale * p.camera.x * width / 2));
    p.screen.y = Math.round((height / 2) - (p.screen.scale * p.camera.y * height / 2));
    p.screen.w = Math.round((p.screen.scale * roadWidth * width / 2));
  }

  function renderSegmentPolygon(ctx, width, y1, x1, w1, y2, x2, w2, color) {
    const r1 = w1 / 6;
    const r2 = w2 / 6;
    const l1 = w1 / 32;
    const l2 = w2 / 32;

    // Grass
    ctx.fillStyle = color.grass;
    ctx.fillRect(0, y2, width, y1 - y2);

    // Rumble Strips
    drawPoly(ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
    drawPoly(ctx, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble);

    // Road Surface
    drawPoly(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

    // Center Dashed White Lines
    if (color.lane) {
      drawPoly(ctx, x1 - l1, y1, x1 + l1, y1, x2 + l2, y2, x2 - l2, y2, color.lane);
    }
  }

  function drawPoly(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }

  // Draw Warm Sunset Sky & Sun
  function drawSkyAndHorizon() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
    grad.addColorStop(0, '#f97316'); // Warm orange sunset
    grad.addColorStop(0.6, '#fbbf24'); // Amber horizon
    grad.addColorStop(1, '#15803d'); // Green distant terrain
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

    // Glowing Sun on Horizon (Matching PDF Page 10 screenshot)
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height * 0.28, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Sprites
  function drawEntitySprite(ctx, type, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (type === 'coin') {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -20, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -20, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('₹', 0, -14);
    } else if (type === 'chai') {
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('☕', 0, -15);
    } else if (type === 'cow') {
      ctx.font = '40px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐄', 0, -10);
    } else if (type === 'pothole') {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(0, -5, 24, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw Player Indian Auto-Rickshaw (Yellow Roof, Green Metallic Body, Rear Windshield)
  function drawPlayerAutoRickshaw() {
    const autoX = canvas.width / 2;
    const autoY = canvas.height - 75;

    ctx.save();
    ctx.translate(autoX, autoY);

    // Bounce with speed
    const bounceY = isPlaying && speed > 0 ? (Math.sin(performance.now() * 0.04) * 2) : 0;
    ctx.translate(0, bounceY);

    // Auto Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 48, 52, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Metallic Green Lower Body
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.roundRect(-42, 5, 84, 40, [6, 6, 2, 2]);
    ctx.fill();

    // Chrome Bumper
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-38, 42, 76, 5);

    // Tail Lights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-36, 20, 10, 8);
    ctx.fillRect(26, 20, 10, 8);

    // Classic License Plate
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-16, 24, 32, 12);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DL 1R 9410', 0, 33);

    // Yellow Canopy / Roof (Iconic Indian Auto)
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.roundRect(-46, -35, 92, 42, [18, 18, 4, 4]);
    ctx.fill();

    // Rear Windshield Window
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-30, -22, 60, 24, [4, 4, 4, 4]);
    ctx.fill();

    // Windshield reflection line
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-20, -18);
    ctx.lineTo(20, -2);
    ctx.stroke();

    ctx.restore();
  }

  function drawNitroSpeedLines() {
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 12; i++) {
      const lineX = (Math.random() * canvas.width);
      const lineY1 = canvas.height * 0.4 + Math.random() * 200;
      const lineY2 = lineY1 + 40 + Math.random() * 60;
      ctx.beginPath();
      ctx.moveTo(lineX, lineY1);
      ctx.lineTo(lineX + (lineX - canvas.width / 2) * 0.1, lineY2);
      ctx.stroke();
    }
  }

  function formatTime(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = (totalSecs % 60).toFixed(1);
    return `${mins}:${secs.padStart(4, '0')}`;
  }

  window.addEventListener('DOMContentLoaded', init);
})();
