// Job Clipper Popup Controller
(function () {
  'use strict';

  // Default preloaded jobs matching PDF Page 12
  let jobs = [
    { id: '1', role: 'Data Analyst Intern', company: 'Nova Labs', deadline: '2026-11-12', url: 'https://nova-labs.space/role', status: 'saved', notes: 'Applied through campus pool' },
    { id: '2', role: 'Software Engineer Intern', company: 'Acme Corp', deadline: '2026-11-20', url: 'https://acme.inc/jobs/swe', status: 'saved', notes: 'Requires Python & React' },
    { id: '3', role: 'AI Research Intern', company: 'Zentra', deadline: '2026-11-08', url: 'https://zentra.ai/apply', status: 'applied', notes: 'Submitted resume v2' },
    { id: '4', role: 'Full Stack Fellow', company: 'Bluebird', deadline: '2026-11-15', url: 'https://bluebird.dev/careers', status: 'interview', notes: 'Round 1 technical interview scheduled' },
    { id: '5', role: 'Frontend Engineer', company: 'Vertex Systems', deadline: '2026-10-30', url: 'https://vertex.io/intern', status: 'result', notes: 'Offer letter received!' }
  ];

  // DOM Elements
  const inpSearch = document.getElementById('inpSearch');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnToggleClipForm = document.getElementById('btnToggleClipForm');
  const clipPanel = document.getElementById('clipPanel');
  const btnCloseClipPanel = document.getElementById('btnCloseClipPanel');
  const btnAddCard = document.getElementById('btnAddCard');
  const dueSoonCount = document.getElementById('dueSoonCount');

  // Clip Form Inputs
  const inpRole = document.getElementById('inpRole');
  const inpCompany = document.getElementById('inpCompany');
  const inpDeadline = document.getElementById('inpDeadline');
  const inpUrl = document.getElementById('inpUrl');

  // Edit Modal Elements
  const editModal = document.getElementById('editModal');
  const editCardId = document.getElementById('editCardId');
  const editRole = document.getElementById('editRole');
  const editCompany = document.getElementById('editCompany');
  const editDeadline = document.getElementById('editDeadline');
  const editNotes = document.getElementById('editNotes');
  const btnCloseEditModal = document.getElementById('btnCloseEditModal');
  const btnSaveEdit = document.getElementById('btnSaveEdit');
  const btnDeleteCard = document.getElementById('btnDeleteCard');

  function init() {
    loadJobs();
    setupEventListeners();
    detectPageDetails();
    renderBoard();
  }

  function loadJobs() {
    const saved = localStorage.getItem('jobClipper_cards');
    if (saved) {
      try { jobs = JSON.parse(saved); } catch (e) {}
    }
  }

  function saveJobs() {
    localStorage.setItem('jobClipper_cards', JSON.stringify(jobs));
  }

  function setupEventListeners() {
    inpSearch.addEventListener('input', renderBoard);
    btnExportCsv.addEventListener('click', exportToCsv);
    btnToggleClipForm.addEventListener('click', () => {
      clipPanel.style.display = clipPanel.style.display === 'none' ? 'flex' : 'none';
    });
    btnCloseClipPanel.addEventListener('click', () => { clipPanel.style.display = 'none'; });
    btnAddCard.addEventListener('click', handleAddCard);

    btnCloseEditModal.addEventListener('click', () => { editModal.style.display = 'none'; });
    btnSaveEdit.addEventListener('click', handleSaveEdit);
    btnDeleteCard.addEventListener('click', handleDeleteCard);
  }

  // Detect active tab details if running in Chrome Extension
  function detectPageDetails() {
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          inpUrl.value = tabs[0].url || '';
          chrome.tabs.sendMessage(tabs[0].id, { type: 'EXTRACT_JOB_DETAILS' }, (res) => {
            if (res) {
              if (res.role) inpRole.value = res.role;
              if (res.company) inpCompany.value = res.company;
              if (res.deadline) inpDeadline.value = res.deadline;
            }
          });
        }
      });
    }
  }

  function handleAddCard() {
    const role = inpRole.value.trim() || 'Software Intern';
    const company = inpCompany.value.trim() || 'Company';
    const deadline = inpDeadline.value;
    const url = inpUrl.value.trim();

    jobs.unshift({
      id: Date.now().toString(),
      role,
      company,
      deadline,
      url,
      status: 'saved',
      notes: ''
    });

    saveJobs();
    renderBoard();
    clipPanel.style.display = 'none';
  }

  // --- KANBAN BOARD DRAG AND DROP ---
  window._dragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  window._dropCard = (e, newStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const card = jobs.find(j => j.id === id);
    if (card) {
      card.status = newStatus;
      saveJobs();
      renderBoard();
    }
  };

  function renderBoard() {
    const q = (inpSearch.value || '').toLowerCase();
    const cols = {
      saved: document.getElementById('colSaved'),
      applied: document.getElementById('colApplied'),
      interview: document.getElementById('colInterview'),
      result: document.getElementById('colResult')
    };

    Object.values(cols).forEach(col => col.innerHTML = '');

    const counts = { saved: 0, applied: 0, interview: 0, result: 0 };
    let dueSoon = 0;
    const now = new Date();

    jobs.forEach(job => {
      // Search filter
      const matches = job.role.toLowerCase().includes(q) ||
                      job.company.toLowerCase().includes(q) ||
                      job.status.toLowerCase().includes(q);
      if (!matches) return;

      counts[job.status] = (counts[job.status] || 0) + 1;

      // Check deadline
      const deadlineDate = new Date(job.deadline);
      const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
      const isDueSoon = diffDays >= 0 && diffDays <= 7;
      if (isDueSoon) dueSoon++;

      const card = document.createElement('div');
      card.className = 'job-card';
      card.draggable = true;
      card.addEventListener('dragstart', (e) => window._dragStart(e, job.id));
      card.addEventListener('click', () => openEditModal(job));

      card.innerHTML = `
        <div class="card-role">${job.role}</div>
        <div class="card-company">${job.company}</div>
        <div class="card-deadline ${isDueSoon ? 'due-soon' : ''}">
          <span>⏰</span> <span>Due: ${job.deadline || 'No date'}</span>
          ${isDueSoon ? '<strong>(Soon!)</strong>' : ''}
        </div>
      `;

      if (cols[job.status]) {
        cols[job.status].appendChild(card);
      }
    });

    document.getElementById('countSaved').textContent = counts.saved || 0;
    document.getElementById('countApplied').textContent = counts.applied || 0;
    document.getElementById('countInterview').textContent = counts.interview || 0;
    document.getElementById('countResult').textContent = counts.result || 0;
    dueSoonCount.textContent = dueSoon;
  }

  // Edit Modal
  function openEditModal(job) {
    editCardId.value = job.id;
    editRole.value = job.role;
    editCompany.value = job.company;
    editDeadline.value = job.deadline || '';
    editNotes.value = job.notes || '';
    editModal.style.display = 'flex';
  }

  function handleSaveEdit() {
    const id = editCardId.value;
    const job = jobs.find(j => j.id === id);
    if (job) {
      job.role = editRole.value.trim();
      job.company = editCompany.value.trim();
      job.deadline = editDeadline.value;
      job.notes = editNotes.value.trim();
      saveJobs();
      renderBoard();
      editModal.style.display = 'none';
    }
  }

  function handleDeleteCard() {
    const id = editCardId.value;
    jobs = jobs.filter(j => j.id !== id);
    saveJobs();
    renderBoard();
    editModal.style.display = 'none';
  }

  // --- CSV EXPORT ---
  // Requirement: "The CSV opens correctly in a spreadsheet."
  function exportToCsv() {
    const headers = ['ID', 'Role', 'Company', 'Status', 'Deadline', 'URL', 'Notes'];
    const rows = jobs.map(j => [
      j.id,
      `"${j.role.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      j.status,
      j.deadline,
      `"${j.url.replace(/"/g, '""')}"`,
      `"${(j.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
