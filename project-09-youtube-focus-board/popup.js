// YouTube Focus Board Popup Controller
(function () {
  'use strict';

  // State
  let focusSettings = {
    hideShorts: true,
    hideRecs: true,
    hideComments: true,
    todayMinutes: 38,
    gateUnlockExpiry: Date.now() + (48 * 60 * 1000),
    gatePurpose: "Revising Thermodynamics Chapter 4",
    studyList: [
      { id: '1', title: 'Lecture 1: First Law of Thermodynamics', completed: true },
      { id: '2', title: 'Lecture 2: Carnot Cycle & Engine Efficiency', completed: false }
    ],
    timestampNotes: [
      { time: '12:40', seconds: 760, text: 'Carnot cycle 4-stage thermodynamic derivation' },
      { time: '24:15', seconds: 1455, text: 'Entropy integral Clausius formulation' }
    ]
  };

  // DOM
  const chkHideShorts = document.getElementById('chkHideShorts');
  const chkHideRecs = document.getElementById('chkHideRecs');
  const chkHideComments = document.getElementById('chkHideComments');
  const todayTimeText = document.getElementById('todayTimeText');
  const gateTimeLeft = document.getElementById('gateTimeLeft');
  const gatePurposeText = document.getElementById('gatePurposeText');
  const gateActiveStatus = document.getElementById('gateActiveStatus');
  const gateUnlockForm = document.getElementById('gateUnlockForm');
  const inpGateReason = document.getElementById('inpGateReason');
  const btnUnlock60 = document.getElementById('btnUnlock60');

  const tabStudyList = document.getElementById('tabStudyList');
  const tabNotes = document.getElementById('tabNotes');
  const studyListView = document.getElementById('studyListView');
  const notesView = document.getElementById('notesView');
  const studyListItems = document.getElementById('studyListItems');
  const notesListItems = document.getElementById('notesListItems');
  const inpNewVideo = document.getElementById('inpNewVideo');
  const btnAddVideo = document.getElementById('btnAddVideo');
  const inpNoteTime = document.getElementById('inpNoteTime');
  const inpNoteText = document.getElementById('inpNoteText');
  const btnAddNote = document.getElementById('btnAddNote');

  function init() {
    loadSettings();
    setupListeners();
    renderUI();
  }

  function loadSettings() {
    const saved = localStorage.getItem('ytFocus_settings');
    if (saved) {
      try { focusSettings = { ...focusSettings, ...JSON.parse(saved) }; } catch (e) {}
    }
  }

  function saveSettings() {
    localStorage.setItem('ytFocus_settings', JSON.stringify(focusSettings));
    // Also notify chrome tabs if running in extension runtime
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'SETTINGS_UPDATED', settings: focusSettings }).catch(() => {});
        }
      });
    }
  }

  function setupListeners() {
    chkHideShorts.addEventListener('change', (e) => { focusSettings.hideShorts = e.target.checked; saveSettings(); });
    chkHideRecs.addEventListener('change', (e) => { focusSettings.hideRecs = e.target.checked; saveSettings(); });
    chkHideComments.addEventListener('change', (e) => { focusSettings.hideComments = e.target.checked; saveSettings(); });

    tabStudyList.addEventListener('click', () => {
      tabStudyList.classList.add('active');
      tabNotes.classList.remove('active');
      studyListView.style.display = 'block';
      notesView.style.display = 'none';
    });

    tabNotes.addEventListener('click', () => {
      tabNotes.classList.add('active');
      tabStudyList.classList.remove('active');
      notesView.style.display = 'block';
      studyListView.style.display = 'none';
    });

    btnAddVideo.addEventListener('click', () => {
      const title = inpNewVideo.value.trim();
      if (!title) return;
      focusSettings.studyList.push({ id: Date.now().toString(), title, completed: false });
      inpNewVideo.value = '';
      renderStudyList();
      saveSettings();
    });

    btnAddNote.addEventListener('click', () => {
      const time = inpNoteTime.value.trim() || '00:00';
      const text = inpNoteText.value.trim();
      if (!text) return;
      const parts = time.split(':').map(Number);
      const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
      focusSettings.timestampNotes.push({ time, seconds, text });
      inpNoteText.value = '';
      renderNotesList();
      saveSettings();
    });

    btnUnlock60.addEventListener('click', () => {
      const purpose = inpGateReason.value.trim();
      if (!purpose) {
        alert('Please specify your study purpose first.');
        return;
      }
      focusSettings.gatePurpose = purpose;
      focusSettings.gateUnlockExpiry = Date.now() + (60 * 60 * 1000);
      saveSettings();
      renderUI();
    });
  }

  function renderUI() {
    chkHideShorts.checked = focusSettings.hideShorts;
    chkHideRecs.checked = focusSettings.hideRecs;
    chkHideComments.checked = focusSettings.hideComments;
    todayTimeText.textContent = `${focusSettings.todayMinutes} min`;

    // Gate status
    const remainingMs = focusSettings.gateUnlockExpiry - Date.now();
    if (remainingMs > 0) {
      gateActiveStatus.style.display = 'block';
      gateUnlockForm.style.display = 'none';
      const mins = Math.ceil(remainingMs / (60 * 1000));
      gateTimeLeft.textContent = `${mins} mins remaining`;
      gatePurposeText.textContent = `"${focusSettings.gatePurpose}"`;
    } else {
      gateActiveStatus.style.display = 'none';
      gateUnlockForm.style.display = 'block';
    }

    renderStudyList();
    renderNotesList();
  }

  function renderStudyList() {
    studyListItems.innerHTML = '';
    focusSettings.studyList.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <span style="display:flex; align-items:center; gap:6px;">
          <input type="checkbox" ${item.completed ? 'checked' : ''} onclick="event.stopPropagation(); window._toggleVideo(${idx})">
          <span style="${item.completed ? 'text-decoration:line-through; color:#64748b;' : ''}">${item.title}</span>
        </span>
        <button style="background:none; border:none; color:#ef4444; cursor:pointer;" onclick="event.stopPropagation(); window._delVideo(${idx})">&times;</button>
      `;
      studyListItems.appendChild(row);
    });
  }

  window._toggleVideo = (i) => {
    focusSettings.studyList[i].completed = !focusSettings.studyList[i].completed;
    renderStudyList();
    saveSettings();
  };
  window._delVideo = (i) => {
    focusSettings.studyList.splice(i, 1);
    renderStudyList();
    saveSettings();
  };

  function renderNotesList() {
    notesListItems.innerHTML = '';
    focusSettings.timestampNotes.forEach((n, idx) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <div>
          <span class="timestamp-pill" onclick="window._jumpTimestamp(${n.seconds})">▶ ${n.time}</span>
          <span>${n.text}</span>
        </div>
        <button style="background:none; border:none; color:#ef4444; cursor:pointer;" onclick="event.stopPropagation(); window._delNote(${idx})">&times;</button>
      `;
      notesListItems.appendChild(row);
    });
  }

  window._jumpTimestamp = (secs) => {
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'JUMP_TIMESTAMP', seconds: secs }).catch(() => {});
        }
      });
    }
  };
  window._delNote = (i) => {
    focusSettings.timestampNotes.splice(i, 1);
    renderNotesList();
    saveSettings();
  };

  window.addEventListener('DOMContentLoaded', init);
})();
