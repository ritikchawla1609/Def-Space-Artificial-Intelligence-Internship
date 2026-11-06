// Reel Monster — Floating Screen Time Counter
// Bharat Space Education Research Centre - GenAI Internship (Week 2, Project 6)

(function () {
  'use strict';

  // State
  let reelCount = 143; // Default realistic start matching PDF
  let countingLevel = 2; // 1 = manual, 2 = automatic
  let currentFeed = 'instagram'; // 'instagram' | 'youtube'
  let isDashboardVisible = false;
  let history7Days = [84, 112, 95, 130, 78, 160, 143];

  // Dragging state
  let isDragging = false;
  let dragOffsetX = 0, dragOffsetY = 0;
  let dragStartTime = 0;

  // DOM Elements
  const monsterBubble = document.getElementById('monsterBubble');
  const monsterSpeechBubble = document.getElementById('monsterSpeechBubble');
  const monsterCounterBadge = document.getElementById('monsterCounterBadge');
  const monsterSvg = document.getElementById('monsterSvg');
  const monsterBody = document.getElementById('monsterBody');
  const monsterMouth = document.getElementById('monsterMouth');
  const pupilLeft = document.getElementById('pupilLeft');
  const pupilRight = document.getElementById('pupilRight');

  const btnSwitchFeed = document.getElementById('btnSwitchFeed');
  const feedNameLabel = document.getElementById('feedNameLabel');
  const socialTag = document.getElementById('socialTag');
  const btnToggleAppView = document.getElementById('btnToggleAppView');
  const appDashboard = document.getElementById('appDashboard');
  const btnNextReel = document.getElementById('btnNextReel');
  const currentReelNum = document.getElementById('currentReelNum');
  const reelVisualIcon = document.getElementById('reelVisualIcon');
  const reelTitle = document.getElementById('reelTitle');
  const likeCount = document.getElementById('likeCount');

  const btnLevel1 = document.getElementById('btnLevel1');
  const btnLevel2 = document.getElementById('btnLevel2');
  const dashTodayCount = document.getElementById('dashTodayCount');
  const dashTimeLost = document.getElementById('dashTimeLost');
  const dashMonsterQuote = document.getElementById('dashMonsterQuote');
  const barChartContainer = document.getElementById('barChartContainer');
  const btnResetDay = document.getElementById('btnResetDay');
  const btnInstallPwa = document.getElementById('btnInstallPwa');
  const phoneScreen = document.getElementById('phoneScreen');

  // Simulated reel feed data
  const DEMO_REELS = [
    { title: "Life Hack #42: Never lose your focus again", icon: "🎬", likes: "142K" },
    { title: "POV: Trying to finish 17 GenAI projects in one week", icon: "⚡", likes: "284K" },
    { title: "Top 5 VS Code shortcuts nobody told you about", icon: "💻", likes: "98K" },
    { title: "Why Carnot engines can never reach 100% efficiency", icon: "🚀", likes: "310K" },
    { title: "Making street chai at 3:00 AM in Old Delhi", icon: "☕", likes: "512K" },
    { title: "Cute golden retriever attempts physics homework", icon: "🐕", likes: "890K" }
  ];
  let currentReelIndex = 0;

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => console.log('SW register failed', err));
    });
  }

  function init() {
    loadSavedData();
    setupEventListeners();
    updateUI();
  }

  function loadSavedData() {
    const saved = localStorage.getItem('reelMonster_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        reelCount = state.reelCount ?? 143;
        countingLevel = state.countingLevel ?? 2;
        history7Days = state.history7Days || history7Days;
      } catch (e) {
        console.warn('Could not restore Reel Monster state', e);
      }
    }
  }

  function saveData() {
    history7Days[6] = reelCount;
    const state = {
      reelCount,
      countingLevel,
      history7Days,
      savedAt: Date.now()
    };
    localStorage.setItem('reelMonster_state', JSON.stringify(state));
  }

  function setupEventListeners() {
    // Feed Toggle
    btnSwitchFeed.addEventListener('click', () => {
      currentFeed = currentFeed === 'instagram' ? 'youtube' : 'instagram';
      feedNameLabel.textContent = currentFeed === 'instagram' ? 'Instagram' : 'Shorts';
      socialTag.textContent = currentFeed === 'instagram' ? 'Instagram Reels' : 'YouTube Shorts';
    });

    // Stats View Toggle
    btnToggleAppView.addEventListener('click', toggleDashboardView);

    // Level Switchers
    btnLevel1.addEventListener('click', () => setLevel(1));
    btnLevel2.addEventListener('click', () => setLevel(2));

    // Next Reel Trigger (Simulating Scroll / Next)
    btnNextReel.addEventListener('click', advanceReel);

    // Draggable & Clickable Monster Bubble
    monsterBubble.addEventListener('mousedown', handleBubbleMouseDown);
    window.addEventListener('mousemove', handleBubbleMouseMove);
    window.addEventListener('mouseup', handleBubbleMouseUp);

    // Touch support for phones
    monsterBubble.addEventListener('touchstart', handleBubbleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleBubbleTouchMove, { passive: false });
    window.addEventListener('touchend', handleBubbleTouchEnd);

    // Reset Day
    btnResetDay.addEventListener('click', () => {
      if (confirm("Reset today's count back to 0?")) {
        reelCount = 0;
        updateUI();
        saveData();
      }
    });

    // Install PWA
    btnInstallPwa.addEventListener('click', () => {
      alert("PWA Manifest & Service Worker Active! On your Android phone, tap Chrome menu (⋮) -> 'Install App' or 'Add to Home screen' to run natively.");
    });
  }

  function setLevel(lvl) {
    countingLevel = lvl;
    btnLevel1.classList.toggle('active', lvl === 1);
    btnLevel2.classList.toggle('active', lvl === 2);
    saveData();
    updateUI();
  }

  function toggleDashboardView() {
    isDashboardVisible = !isDashboardVisible;
    if (isDashboardVisible) {
      appDashboard.classList.remove('hidden');
      btnToggleAppView.classList.add('active');
    } else {
      appDashboard.classList.add('hidden');
      btnToggleAppView.classList.remove('active');
    }
  }

  function advanceReel() {
    currentReelIndex = (currentReelIndex + 1) % DEMO_REELS.length;
    const r = DEMO_REELS[currentReelIndex];
    currentReelNum.textContent = currentReelIndex + 1;
    reelTitle.textContent = r.title;
    reelVisualIcon.textContent = r.icon;
    likeCount.textContent = r.likes;

    // In Level 2 (Automatic), reel counts automatically
    if (countingLevel === 2) {
      incrementCount();
    }
  }

  function incrementCount() {
    reelCount++;
    playBiteAnimation();
    updateUI();
    saveData();
  }

  function playBiteAnimation() {
    // Animated Monster chew & grow
    monsterMouth.setAttribute('d', 'M 35 60 Q 50 78 65 60'); // wide open mouth
    monsterBubble.style.transform = 'scale(1.2) rotate(-5deg)';
    setTimeout(() => {
      monsterMouth.setAttribute('d', 'M 42 64 Q 50 70 58 64');
      monsterBubble.style.transform = 'scale(1.0) rotate(0deg)';
    }, 200);
  }

  // Dragging Logic
  function handleBubbleMouseDown(e) {
    isDragging = true;
    dragStartTime = Date.now();
    const rect = monsterBubble.getBoundingClientRect();
    const parentRect = phoneScreen.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
  }

  function handleBubbleMouseMove(e) {
    if (!isDragging) return;
    const parentRect = phoneScreen.getBoundingClientRect();
    let left = e.clientX - parentRect.left - dragOffsetX;
    let top = e.clientY - parentRect.top - dragOffsetY;

    // Boundaries
    left = Math.max(10, Math.min(parentRect.width - 90, left));
    top = Math.max(10, Math.min(parentRect.height - 110, top));

    monsterBubble.style.left = `${left}px`;
    monsterBubble.style.top = `${top}px`;
    monsterBubble.style.right = 'auto';
  }

  function handleBubbleMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;
    const dragDuration = Date.now() - dragStartTime;

    // If quick tap (duration < 250ms), treat as click
    if (dragDuration < 250) {
      // In Level 1, manual tap increments
      if (countingLevel === 1) {
        incrementCount();
      } else {
        // In Level 2, tapping makes monster giggle or speak
        playBiteAnimation();
        updateMonsterDialogue();
      }
    }
  }

  // Touch handlers
  function handleBubbleTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      dragStartTime = Date.now();
      const rect = monsterBubble.getBoundingClientRect();
      const parentRect = phoneScreen.getBoundingClientRect();
      dragOffsetX = e.touches[0].clientX - rect.left;
      dragOffsetY = e.touches[0].clientY - rect.top;
    }
  }

  function handleBubbleTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const parentRect = phoneScreen.getBoundingClientRect();
      let left = e.touches[0].clientX - parentRect.left - dragOffsetX;
      let top = e.touches[0].clientY - parentRect.top - dragOffsetY;

      left = Math.max(10, Math.min(parentRect.width - 90, left));
      top = Math.max(10, Math.min(parentRect.height - 110, top));

      monsterBubble.style.left = `${left}px`;
      monsterBubble.style.top = `${top}px`;
      monsterBubble.style.right = 'auto';
    }
  }

  function handleBubbleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const dragDuration = Date.now() - dragStartTime;
    if (dragDuration < 250) {
      if (countingLevel === 1) {
        incrementCount();
      } else {
        playBiteAnimation();
        updateMonsterDialogue();
      }
    }
  }

  // Update Monster Evolution & Text
  function updateUI() {
    monsterCounterBadge.textContent = reelCount;
    dashTodayCount.textContent = reelCount;

    // Calculate time lost: approx 30 seconds per reel
    const totalSeconds = reelCount * 30;
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const timeLostStr = hours > 0 ? `${hours}h ${mins}m lost` : `${mins}m lost`;
    dashTimeLost.textContent = `${timeLostStr} to infinite scrolling`;

    updateMonsterDialogue();
    renderChart();
  }

  function updateMonsterDialogue() {
    let quote = '';
    let speech = '';

    if (reelCount <= 5) {
      speech = countingLevel === 1 ? 'Tap me +1' : 'Watching you...';
      quote = '"Just warming up! Put the phone down whenever you want."';
      monsterBody.setAttribute('fill', '#ec4899'); // Cute pink
    } else if (reelCount <= 20) {
      speech = 'Mmm tasty reels!';
      quote = '"Mmm tasty reels... but your homework is crying!"';
      monsterBody.setAttribute('fill', '#d946ef');
    } else if (reelCount <= 60) {
      speech = 'Evening tastes great!';
      quote = '"Yum! Your evening tastes great."';
      monsterBody.setAttribute('fill', '#8b5cf6'); // Chubby purple
    } else if (reelCount <= 120) {
      speech = 'Burp! Still scrolling?';
      quote = '"Burp! 1 hour lost. Your assignments are crying in a corner."';
      monsterBody.setAttribute('fill', '#7c3aed');
    } else {
      speech = 'Burp. Homework says hi.';
      quote = `"Burp. Your homework says hi. ${reelCount} reels · over 1h lost!"`;
      monsterBody.setAttribute('fill', '#6d28d9'); // Giant gluttonous monster
    }

    monsterSpeechBubble.textContent = speech;
    dashMonsterQuote.textContent = quote;
  }

  // Render 7-day Bar Chart
  function renderChart() {
    barChartContainer.innerHTML = '';
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    const maxVal = Math.max(...history7Days, 150);

    history7Days.forEach((val, idx) => {
      const col = document.createElement('div');
      col.className = 'chart-bar-col';

      const fill = document.createElement('div');
      fill.className = 'chart-bar-fill';
      const heightPercent = Math.max(5, Math.round((val / maxVal) * 100));
      fill.style.height = `${heightPercent}%`;
      fill.title = `${dayLabels[idx]}: ${val} reels`;

      const dayText = document.createElement('span');
      dayText.className = 'chart-bar-day';
      dayText.textContent = dayLabels[idx];

      col.appendChild(fill);
      col.appendChild(dayText);
      barChartContainer.appendChild(col);
    });
  }

  window.addEventListener('DOMContentLoaded', init);
})();
