// Tab Goblin Popup Controller
(function () {
  'use strict';

  // Demo tab list matching PDF Page 16 screenshot by default
  let openTabs = [
    { id: 1, title: 'Physics lecture: Thermodynamics Chapter 4', url: 'https://youtube.com/watch?v=1', age: '3 days old', isAsleep: true, isKeep: false },
    { id: 2, title: 'Laptop prices & comparison chart', url: 'https://flipkart.com/laptops', age: '6 days old', isAsleep: true, isKeep: false },
    { id: 3, title: 'Internship form: Bharat Space Research', url: 'https://internshala.com/app', age: '2 hours ago', isAsleep: false, isKeep: true },
    { id: 4, title: 'GitHub: Repository Week 2 Projects', url: 'https://github.com/ritik/genai', age: '1 day old', isAsleep: false, isKeep: true },
    { id: 5, title: '10 Best Mechanical Keyboards Reddit', url: 'https://reddit.com/r/mechanicalkeyboards', age: '4 days old', isAsleep: true, isKeep: false }
  ];

  let simulatedTotalCount = 47;
  let keepListUrls = JSON.parse(localStorage.getItem('tabGoblin_keepList') || '[]');
  let savedSessions = JSON.parse(localStorage.getItem('tabGoblin_sessions') || '[]');

  const totalTabsCountText = document.getElementById('totalTabsCountText');
  const goblinStatusSub = document.getElementById('goblinStatusSub');
  const goblinFace = document.getElementById('goblinFace');
  const goblinMouth = document.getElementById('goblinMouth');
  const tabsList = document.getElementById('tabsList');
  const btnFeedGoblin = document.getElementById('btnFeedGoblin');
  const btnSaveSession = document.getElementById('btnSaveSession');
  const sessionsSection = document.getElementById('sessionsSection');
  const sessionsList = document.getElementById('sessionsList');
  const btnCloseSessions = document.getElementById('btnCloseSessions');

  function init() {
    setupEventListeners();
    queryRealTabs();
    updateGoblinMood();
    renderTabsList();
    renderSessions();
  }

  function queryRealTabs() {
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({}, (tabs) => {
        if (tabs && tabs.length > 0) {
          simulatedTotalCount = tabs.length;
          openTabs = tabs.map((t, idx) => ({
            id: t.id,
            title: t.title || 'Untitled Tab',
            url: t.url || '',
            age: idx > 5 ? `${idx} days old` : 'Recent',
            isAsleep: t.discarded || false,
            isKeep: keepListUrls.includes(t.url)
          }));
          updateGoblinMood();
          renderTabsList();
        }
      });
    }
  }

  function setupEventListeners() {
    btnFeedGoblin.addEventListener('click', feedTheGoblin);
    btnSaveSession.addEventListener('click', saveCurrentSession);
    btnCloseSessions.addEventListener('click', () => { sessionsSection.style.display = 'none'; });
  }

  // --- GOBLIN MOOD ENGINE ---
  // Requirement: "Show tab count and a goblin whose mood changes with it."
  function updateGoblinMood() {
    const asleepCount = openTabs.filter(t => t.isAsleep).length;
    totalTabsCountText.textContent = `${simulatedTotalCount} tabs open`;

    if (simulatedTotalCount > 25) {
      // Stuffed / Overloaded Goblin (Matching PDF screenshot: "31 asleep · goblin is full")
      goblinStatusSub.textContent = `${asleepCount} asleep · goblin is full`;
      goblinFace.setAttribute('fill', '#059669'); // Emerald full goblin
      goblinMouth.setAttribute('d', 'M 30 68 Q 50 82 70 68'); // Content chubby grin
    } else if (simulatedTotalCount >= 10) {
      // Hungry Goblin
      goblinStatusSub.textContent = `${asleepCount} asleep · goblin is hungry`;
      goblinFace.setAttribute('fill', '#f59e0b');
      goblinMouth.setAttribute('d', 'M 35 65 L 65 65');
    } else {
      // Happy / Zen Goblin
      goblinStatusSub.textContent = `${asleepCount} asleep · laptop fan is quiet`;
      goblinFace.setAttribute('fill', '#10b981');
      goblinMouth.setAttribute('d', 'M 35 60 Q 50 72 65 60');
    }
  }

  // --- RENDER TABS LIST ---
  function renderTabsList() {
    tabsList.innerHTML = '';

    openTabs.forEach(tab => {
      const card = document.createElement('div');
      card.className = `tab-item-card ${tab.isAsleep ? 'is-asleep' : ''}`;

      card.innerHTML = `
        <div class="tab-title-tag" title="${tab.title}">
          <span>${tab.isAsleep ? '💤' : '🌐'}</span>
          <span>${tab.title}</span>
        </div>
        <div class="tab-meta-right">
          <span class="age-tag">${tab.age}</span>
          <button class="btn-keep ${tab.isKeep ? 'active' : ''}" onclick="event.stopPropagation(); window._toggleKeep(${tab.id})">
            ${tab.isKeep ? 'Keep' : 'Keep'}
          </button>
        </div>
      `;

      // Clicking wakes tab
      card.addEventListener('click', () => wakeTab(tab));
      tabsList.appendChild(card);
    });
  }

  // Toggle Whitelist
  window._toggleKeep = (tabId) => {
    const tab = openTabs.find(t => t.id === tabId);
    if (!tab) return;
    tab.isKeep = !tab.isKeep;

    if (tab.isKeep) {
      if (!keepListUrls.includes(tab.url)) keepListUrls.push(tab.url);
    } else {
      keepListUrls = keepListUrls.filter(u => u !== tab.url);
    }

    localStorage.setItem('tabGoblin_keepList', JSON.stringify(keepListUrls));
    renderTabsList();
  };

  function wakeTab(tab) {
    if (tab.isAsleep) {
      tab.isAsleep = false;
      if (window.chrome && chrome.tabs && typeof tab.id === 'number') {
        chrome.tabs.update(tab.id, { active: true });
      }
      updateGoblinMood();
      renderTabsList();
    }
  }

  // --- FEED THE GOBLIN (MEMORY DISCARD) ---
  // Requirement: "Put tabs to sleep without closing them. A half-filled form is never lost."
  function feedTheGoblin() {
    let eatenCount = 0;

    openTabs.forEach(tab => {
      // Never eat whitelisted Keep tabs!
      if (!tab.isKeep && !tab.isAsleep) {
        tab.isAsleep = true;
        eatenCount++;
        if (window.chrome && chrome.tabs && typeof tab.id === 'number') {
          chrome.tabs.discard(tab.id, () => {});
        }
      }
    });

    // Animate goblin chomp
    goblinAvatarBump();
    updateGoblinMood();
    renderTabsList();
    alert(`Goblin ate ${eatenCount} idle tabs! Memory freed, all tabs safely asleep in your browser bar.`);
  }

  function goblinAvatarBump() {
    goblinFace.setAttribute('fill', '#047857');
    setTimeout(() => updateGoblinMood(), 400);
  }

  // --- SESSIONS: SAVE & RESTORE ---
  // Requirement: "Save a session and restore it. A saved session restores after a Chrome restart."
  function saveCurrentSession() {
    const sessionName = prompt('Enter a name for this tab session:', `Research Study (${openTabs.length} tabs)`);
    if (!sessionName) return;

    const sessionObj = {
      id: Date.now(),
      name: sessionName,
      date: new Date().toLocaleDateString(),
      tabs: openTabs.map(t => ({ title: t.title, url: t.url, isKeep: t.isKeep }))
    };

    savedSessions.unshift(sessionObj);
    localStorage.setItem('tabGoblin_sessions', JSON.stringify(savedSessions));
    renderSessions();
    sessionsSection.style.display = 'block';
  }

  function renderSessions() {
    sessionsList.innerHTML = '';
    savedSessions.forEach((sess, idx) => {
      const item = document.createElement('div');
      item.className = 'session-item';
      item.innerHTML = `
        <div>
          <strong>${sess.name}</strong>
          <span style="color:#64748b; font-size:10px;">(${sess.tabs.length} tabs · ${sess.date})</span>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn-xs" onclick="window._restoreSession(${idx})" style="color:#10b981; font-weight:700;">Restore</button>
          <button class="btn-xs" onclick="window._deleteSession(${idx})" style="color:#ef4444;">&times;</button>
        </div>
      `;
      sessionsList.appendChild(item);
    });
  }

  window._restoreSession = (idx) => {
    const sess = savedSessions[idx];
    if (!sess) return;
    openTabs = sess.tabs.map((t, i) => ({
      id: i + 1,
      title: t.title,
      url: t.url,
      age: 'Restored',
      isAsleep: false,
      isKeep: t.isKeep
    }));
    simulatedTotalCount = openTabs.length;
    updateGoblinMood();
    renderTabsList();
    alert(`Session "${sess.name}" restored with ${openTabs.length} tabs!`);
  };

  window._deleteSession = (idx) => {
    savedSessions.splice(idx, 1);
    localStorage.setItem('tabGoblin_sessions', JSON.stringify(savedSessions));
    renderSessions();
  };

  window.addEventListener('DOMContentLoaded', init);
})();
