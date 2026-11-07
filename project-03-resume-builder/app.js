// Resume Builder — 100% Offline Live A4 Resume Studio
// Bharat Space Education Research Centre - GenAI Internship (Week 2, Project 3)

(function () {
  'use strict';

  // State
  let currentTemplate = 'template-executive';
  let zoomLevel = 0.95;
  let sectionOrder = ['experience', 'projects', 'skills', 'education'];

  // Resume Data Model
  let resumeData = {
    personal: {
      fullName: 'Riya Sharma',
      title: 'GenAI Engineer & Systems Developer',
      email: 'riya@example.com',
      phone: '+91 98765 43210',
      linkedin: 'linkedin.com/in/riyasharma',
      github: 'github.com/riyasharma',
      summary: 'High-performing GenAI and software intern with deep expertise in offline-first browser engineering, computer vision, and Chrome extension architecture. Proven record building fast, resilient applications.'
    },
    skills: {
      languages: 'Python, JavaScript, TypeScript, C++, SQL, Bash',
      frameworks: 'React, Node.js, Web APIs, PDF-Lib, Canvas API, Git',
      specializations: 'LLM Fine-Tuning, Offline-First Architecture, Browser Extensions'
    },
    experience: [
      {
        id: 'exp1',
        role: 'GenAI Engineering Intern',
        company: 'Bharat Space Education Research Centre',
        dates: '2026 - Present',
        bullets: [
          'Architected 17 offline-first desktop web tools, Chrome extensions, and browser engines.',
          'Implemented client-side PDF manipulation suite with 29 tools utilizing WebAssembly & Canvas.',
          'Engineered binary-search image compression engine meeting UPSC and GATE form specifications.'
        ]
      },
      {
        id: 'exp2',
        role: 'Frontend Systems Intern',
        company: 'Nova Labs Aerospace',
        dates: '2025 - 2026',
        bullets: [
          'Constructed high-speed telemetry dashboards with zero external runtime dependencies.',
          'Optimized DOM rendering performance resulting in a 45% reduction in main-thread CPU latency.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj1',
        title: 'PDF Studio — Offline Document Suite',
        tech: 'JavaScript, PDF-Lib, PDF.js, Canvas API',
        date: '2026',
        bullets: [
          'Engineered full browser-based PDF suite handling 50+ page documents with zero cloud uploads.',
          'Implemented permanent bitmap rasterization redaction guaranteeing complete privacy.'
        ]
      },
      {
        id: 'proj2',
        title: 'CBT Mock Test Engine',
        tech: 'Vanilla JS, LocalStorage, CSS Grid',
        date: '2026',
        bullets: [
          'Simulated official NTA/JEE computer-based examination interface with real question palette.',
          'Constructed fault-tolerant state recovery restoring candidate progress upon unexpected crash.'
        ]
      }
    ],
    education: [
      {
        id: 'edu1',
        degree: 'B.Tech in Computer Science & Artificial Intelligence',
        school: 'Institute of Technology & Science',
        dates: '2023 - 2027',
        score: 'CGPA: 9.2 / 10'
      }
    ]
  };

  // DOM Elements
  const templateSelect = document.getElementById('templateSelect');
  const btnExportPdf = document.getElementById('btnExportPdf');
  const btnExportJson = document.getElementById('btnExportJson');
  const importJsonInput = document.getElementById('importJsonInput');
  const resumeDocument = document.getElementById('resumeDocument');
  const sectionOrderContainer = document.getElementById('sectionOrderContainer');
  const btnAddExp = document.getElementById('btnAddExp');
  const btnAddProject = document.getElementById('btnAddProject');
  const btnAddEdu = document.getElementById('btnAddEdu');
  const experienceList = document.getElementById('experienceList');
  const projectsList = document.getElementById('projectsList');
  const educationList = document.getElementById('educationList');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnFitPage = document.getElementById('btnFitPage');
  const zoomText = document.getElementById('zoomText');

  function init() {
    loadSavedState();
    bindPersonalInputs();
    bindSkillsInputs();
    renderSectionOrderChips();
    renderDynamicFormLists();
    setupEventListeners();
    updateLivePreview();
  }

  function loadSavedState() {
    const saved = localStorage.getItem('resumeBuilder_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        resumeData = parsed.resumeData || resumeData;
        sectionOrder = parsed.sectionOrder || sectionOrder;
        currentTemplate = parsed.currentTemplate || currentTemplate;
        templateSelect.value = currentTemplate;
      } catch (e) {
        console.warn('Could not parse saved resume data', e);
      }
    }
  }

  function saveState() {
    try {
      localStorage.setItem('resumeBuilder_data', JSON.stringify({
        resumeData,
        sectionOrder,
        currentTemplate
      }));
    } catch (e) {
      console.warn('Could not save resume data to localStorage:', e);
    }
  }

  function setupEventListeners() {
    templateSelect.addEventListener('change', (e) => {
      currentTemplate = e.target.value;
      saveState();
      updateLivePreview();
    });

    btnExportPdf.addEventListener('click', handleExportPdf);
    btnExportJson.addEventListener('click', handleExportJson);
    importJsonInput.addEventListener('change', handleImportJson);

    // Mobile pane toggle listeners
    const btnTabEdit = document.getElementById('btnTabEdit');
    const btnTabPreview = document.getElementById('btnTabPreview');
    const editorPane = document.querySelector('.editor-pane');
    const previewPane = document.querySelector('.preview-pane');

    if (btnTabEdit && btnTabPreview && editorPane && previewPane) {
      btnTabEdit.addEventListener('click', () => {
        btnTabEdit.classList.add('active');
        btnTabPreview.classList.remove('active');
        editorPane.classList.remove('hidden-pane');
        previewPane.classList.add('hidden-pane');
      });

      btnTabPreview.addEventListener('click', () => {
        btnTabPreview.classList.add('active');
        btnTabEdit.classList.remove('active');
        previewPane.classList.remove('hidden-pane');
        editorPane.classList.add('hidden-pane');
      });
    }

    btnAddExp.addEventListener('click', () => {
      resumeData.experience.push({
        id: 'exp_' + Date.now(),
        role: 'Software Engineer',
        company: 'Company Name',
        dates: '2026',
        bullets: ['Accomplished X as measured by Y by doing Z.']
      });
      renderDynamicFormLists();
      updateLivePreview();
      saveState();
    });

    btnAddProject.addEventListener('click', () => {
      resumeData.projects.push({
        id: 'proj_' + Date.now(),
        title: 'Project Name',
        tech: 'Tech Stack',
        date: '2026',
        bullets: ['Key achievement or technical impact of this project.']
      });
      renderDynamicFormLists();
      updateLivePreview();
      saveState();
    });

    btnAddEdu.addEventListener('click', () => {
      resumeData.education.push({
        id: 'edu_' + Date.now(),
        degree: 'Degree Name',
        school: 'University / Institute',
        dates: '2024 - 2026',
        score: 'Score / GPA'
      });
      renderDynamicFormLists();
      updateLivePreview();
      saveState();
    });

    btnZoomIn.addEventListener('click', () => setZoom(zoomLevel + 0.1));
    btnZoomOut.addEventListener('click', () => setZoom(Math.max(0.4, zoomLevel - 0.1)));
    btnFitPage.addEventListener('click', () => setZoom(0.95));
  }

  function setZoom(val) {
    zoomLevel = Math.max(0.4, Math.min(1.5, val));
    resumeDocument.style.transform = `scale(${zoomLevel})`;
    zoomText.textContent = `${Math.round(zoomLevel * 100)}%`;
  }

  function bindPersonalInputs() {
    const map = {
      inpFullName: 'fullName',
      inpTitle: 'title',
      inpEmail: 'email',
      inpPhone: 'phone',
      inpLinkedin: 'linkedin',
      inpGithub: 'github',
      inpSummary: 'summary'
    };

    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = resumeData.personal[map[id]] || '';
        el.addEventListener('input', (e) => {
          resumeData.personal[map[id]] = e.target.value;
          updateLivePreview();
          saveState();
        });
      }
    });
  }

  function bindSkillsInputs() {
    const map = {
      inpSkillsLanguages: 'languages',
      inpSkillsFrameworks: 'frameworks',
      inpSkillsSpecial: 'specializations'
    };

    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = resumeData.skills[map[id]] || '';
        el.addEventListener('input', (e) => {
          resumeData.skills[map[id]] = e.target.value;
          updateLivePreview();
          saveState();
        });
      }
    });
  }

  // Section Reordering
  function renderSectionOrderChips() {
    sectionOrderContainer.innerHTML = '';
    const sectionNames = {
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education'
    };

    sectionOrder.forEach((sec, idx) => {
      const chip = document.createElement('div');
      chip.className = 'order-chip';
      chip.innerHTML = `
        <span>${sectionNames[sec]}</span>
        <button class="btn-chip-arrow" title="Move Left" onclick="window._moveSec(${idx}, -1)">‹</button>
        <button class="btn-chip-arrow" title="Move Right" onclick="window._moveSec(${idx}, 1)">›</button>
      `;
      sectionOrderContainer.appendChild(chip);
    });
  }

  window._moveSec = (index, delta) => {
    const target = index + delta;
    if (target >= 0 && target < sectionOrder.length) {
      const temp = sectionOrder[index];
      sectionOrder[index] = sectionOrder[target];
      sectionOrder[target] = temp;
      renderSectionOrderChips();
      updateLivePreview();
      saveState();
    }
  };

  // Dynamic Lists in Editor
  function renderDynamicFormLists() {
    // Experience
    experienceList.innerHTML = '';
    resumeData.experience.forEach((exp, idx) => {
      const card = document.createElement('div');
      card.className = 'dynamic-item-card';
      card.innerHTML = `
        <button class="btn-remove-item" onclick="window._removeExp(${idx})">&times;</button>
        <div class="input-row">
          <div class="form-field"><label>Role / Position</label><input type="text" value="${exp.role}" oninput="window._updateExp(${idx}, 'role', this.value)"></div>
          <div class="form-field"><label>Company</label><input type="text" value="${exp.company}" oninput="window._updateExp(${idx}, 'company', this.value)"></div>
        </div>
        <div class="form-field"><label>Dates</label><input type="text" value="${exp.dates}" oninput="window._updateExp(${idx}, 'dates', this.value)"></div>
        <div class="form-field"><label>Bullet Points (One per line)</label><textarea rows="3" oninput="window._updateExpBullets(${idx}, this.value)">${exp.bullets.join('\n')}</textarea></div>
      `;
      experienceList.appendChild(card);
    });

    // Projects
    projectsList.innerHTML = '';
    resumeData.projects.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'dynamic-item-card';
      card.innerHTML = `
        <button class="btn-remove-item" onclick="window._removeProj(${idx})">&times;</button>
        <div class="input-row">
          <div class="form-field"><label>Project Title</label><input type="text" value="${proj.title}" oninput="window._updateProj(${idx}, 'title', this.value)"></div>
          <div class="form-field"><label>Tech Stack</label><input type="text" value="${proj.tech}" oninput="window._updateProj(${idx}, 'tech', this.value)"></div>
        </div>
        <div class="form-field"><label>Bullet Points (One per line)</label><textarea rows="2" oninput="window._updateProjBullets(${idx}, this.value)">${proj.bullets.join('\n')}</textarea></div>
      `;
      projectsList.appendChild(card);
    });

    // Education
    educationList.innerHTML = '';
    resumeData.education.forEach((edu, idx) => {
      const card = document.createElement('div');
      card.className = 'dynamic-item-card';
      card.innerHTML = `
        <button class="btn-remove-item" onclick="window._removeEdu(${idx})">&times;</button>
        <div class="input-row">
          <div class="form-field"><label>Degree</label><input type="text" value="${edu.degree}" oninput="window._updateEdu(${idx}, 'degree', this.value)"></div>
          <div class="form-field"><label>Institution</label><input type="text" value="${edu.school}" oninput="window._updateEdu(${idx}, 'school', this.value)"></div>
        </div>
        <div class="input-row">
          <div class="form-field"><label>Dates</label><input type="text" value="${edu.dates}" oninput="window._updateEdu(${idx}, 'dates', this.value)"></div>
          <div class="form-field"><label>Score / CGPA</label><input type="text" value="${edu.score}" oninput="window._updateEdu(${idx}, 'score', this.value)"></div>
        </div>
      `;
      educationList.appendChild(card);
    });
  }

  // Global mutators for dynamic form lists
  window._removeExp = (i) => { resumeData.experience.splice(i, 1); renderDynamicFormLists(); updateLivePreview(); saveState(); };
  window._updateExp = (i, k, v) => { resumeData.experience[i][k] = v; updateLivePreview(); saveState(); };
  window._updateExpBullets = (i, v) => { resumeData.experience[i].bullets = v.split('\n').filter(Boolean); updateLivePreview(); saveState(); };

  window._removeProj = (i) => { resumeData.projects.splice(i, 1); renderDynamicFormLists(); updateLivePreview(); saveState(); };
  window._updateProj = (i, k, v) => { resumeData.projects[i][k] = v; updateLivePreview(); saveState(); };
  window._updateProjBullets = (i, v) => { resumeData.projects[i].bullets = v.split('\n').filter(Boolean); updateLivePreview(); saveState(); };

  window._removeEdu = (i) => { resumeData.education.splice(i, 1); renderDynamicFormLists(); updateLivePreview(); saveState(); };
  window._updateEdu = (i, k, v) => { resumeData.education[i][k] = v; updateLivePreview(); saveState(); };

  // --- RENDER LIVE A4 PREVIEW ---
  function updateLivePreview() {
    resumeDocument.className = `a4-page ${currentTemplate}`;

    if (currentTemplate === 'template-executive') {
      renderExecutiveTemplate();
    } else if (currentTemplate === 'template-modern') {
      renderModernTemplate();
    } else {
      renderTechnicalTemplate();
    }
  }

  // Template 2: Executive Two-Column
  function renderExecutiveTemplate() {
    const { personal, skills, experience, projects, education } = resumeData;

    let mainSectionsHtml = '';
    sectionOrder.forEach(secKey => {
      if (secKey === 'experience') {
        mainSectionsHtml += `
          <div class="resume-section">
            <h3 class="exec-section-heading">Experience</h3>
            ${experience.map(e => `
              <div class="exec-entry">
                <div class="exec-entry-header">
                  <span class="exec-entry-role">${e.role}</span>
                  <span class="exec-entry-date">${e.dates}</span>
                </div>
                <div class="exec-entry-company">${e.company}</div>
                <ul class="exec-bullets">
                  ${e.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `;
      } else if (secKey === 'projects') {
        mainSectionsHtml += `
          <div class="resume-section">
            <h3 class="exec-section-heading">Projects</h3>
            ${projects.map(p => `
              <div class="exec-entry">
                <div class="exec-entry-header">
                  <span class="exec-entry-role">${p.title}</span>
                  <span class="exec-entry-date">${p.date}</span>
                </div>
                <div class="exec-entry-company">${p.tech}</div>
                <ul class="exec-bullets">
                  ${p.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `;
      }
    });

    resumeDocument.innerHTML = `
      <aside class="exec-sidebar">
        <div>
          <h1>${personal.fullName}</h1>
          <div class="exec-title">${personal.title}</div>
        </div>

        <div class="exec-side-block">
          <div class="exec-side-heading">Contact</div>
          <div class="exec-contact-item">📧 ${personal.email}</div>
          <div class="exec-contact-item">📞 ${personal.phone}</div>
          <div class="exec-contact-item">🔗 ${personal.linkedin}</div>
          <div class="exec-contact-item">💻 ${personal.github}</div>
        </div>

        <div class="exec-side-block">
          <div class="exec-side-heading">Skills</div>
          <div class="exec-contact-item" style="margin-bottom:6px;"><strong>Core:</strong><br>${skills.languages}</div>
          <div class="exec-contact-item" style="margin-bottom:6px;"><strong>Frameworks:</strong><br>${skills.frameworks}</div>
          <div class="exec-contact-item"><strong>Focus:</strong><br>${skills.specializations}</div>
        </div>

        <div class="exec-side-block">
          <div class="exec-side-heading">Education</div>
          ${education.map(ed => `
            <div style="font-size:11.5px; margin-bottom:8px;">
              <strong>${ed.degree}</strong><br>
              <span style="color:#94a3b8;">${ed.school} (${ed.dates})</span><br>
              <span style="color:#38bdf8;">${ed.score}</span>
            </div>
          `).join('')}
        </div>
      </aside>

      <section class="exec-main">
        <div class="resume-section">
          <h3 class="exec-section-heading">Professional Summary</h3>
          <p style="font-size:12px; color:#334155; line-height:1.6;">${personal.summary}</p>
        </div>
        ${mainSectionsHtml}
      </section>
    `;
  }

  // Template 1: Modern Clean
  function renderModernTemplate() {
    const { personal, skills, experience, projects, education } = resumeData;

    let sectionsHtml = '';
    sectionOrder.forEach(secKey => {
      if (secKey === 'experience') {
        sectionsHtml += `
          <div class="resume-section" style="margin-bottom:16px;">
            <h3 style="font-size:14px; color:#1e40af; border-bottom:1px solid #bfdbfe; padding-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Experience</h3>
            ${experience.map(e => `
              <div style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px;">
                  <span>${e.role} · <span style="color:#2563eb; font-weight:600;">${e.company}</span></span>
                  <span style="color:#64748b; font-size:11px;">${e.dates}</span>
                </div>
                <ul style="margin-left:18px; margin-top:4px; font-size:11.5px; color:#334155; line-height:1.5;">
                  ${e.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `;
      } else if (secKey === 'projects') {
        sectionsHtml += `
          <div class="resume-section" style="margin-bottom:16px;">
            <h3 style="font-size:14px; color:#1e40af; border-bottom:1px solid #bfdbfe; padding-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Projects</h3>
            ${projects.map(p => `
              <div style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px;">
                  <span>${p.title} <span style="font-size:11px; color:#64748b; font-weight:normal;">(${p.tech})</span></span>
                  <span style="color:#64748b; font-size:11px;">${p.date}</span>
                </div>
                <ul style="margin-left:18px; margin-top:4px; font-size:11.5px; color:#334155; line-height:1.5;">
                  ${p.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `;
      } else if (secKey === 'skills') {
        sectionsHtml += `
          <div class="resume-section" style="margin-bottom:16px;">
            <h3 style="font-size:14px; color:#1e40af; border-bottom:1px solid #bfdbfe; padding-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Technical Skills</h3>
            <div style="font-size:11.5px; margin-top:6px; line-height:1.6; color:#334155;">
              <strong>Languages:</strong> ${skills.languages}<br>
              <strong>Frameworks & Tools:</strong> ${skills.frameworks}<br>
              <strong>Domain Focus:</strong> ${skills.specializations}
            </div>
          </div>
        `;
      } else if (secKey === 'education') {
        sectionsHtml += `
          <div class="resume-section" style="margin-bottom:16px;">
            <h3 style="font-size:14px; color:#1e40af; border-bottom:1px solid #bfdbfe; padding-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Education</h3>
            ${education.map(ed => `
              <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:12px;">
                <div><strong>${ed.degree}</strong> — ${ed.school}</div>
                <div style="color:#64748b;">${ed.dates} | ${ed.score}</div>
              </div>
            `).join('')}
          </div>
        `;
      }
    });

    resumeDocument.innerHTML = `
      <div class="modern-header">
        <div>
          <h1>${personal.fullName}</h1>
          <div class="modern-title">${personal.title}</div>
        </div>
        <div class="modern-contact">
          <span>${personal.email}</span> ·
          <span>${personal.phone}</span> ·
          <span>${personal.linkedin}</span> ·
          <span>${personal.github}</span>
        </div>
      </div>
      <div style="padding-top:16px;">
        <p style="font-size:12px; color:#334155; line-height:1.5; margin-bottom:16px;">${personal.summary}</p>
        ${sectionsHtml}
      </div>
    `;
  }

  // Template 3: Technical Classic
  function renderTechnicalTemplate() {
    const { personal, skills, experience, projects, education } = resumeData;

    let sectionsHtml = '';
    sectionOrder.forEach(secKey => {
      if (secKey === 'experience') {
        sectionsHtml += `
          <div class="resume-section" style="margin-bottom:14px;">
            <h3 style="font-size:13px; font-weight:bold; border-bottom:1px solid #333; padding-bottom:2px; text-transform:uppercase;">Experience</h3>
            ${experience.map(e => `
              <div style="margin-top:8px;">
                <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:12.5px;">
                  <span>${e.company} — <em>${e.role}</em></span>
                  <span>${e.dates}</span>
                </div>
                <ul style="margin-left:20px; font-size:11px; line-height:1.5;">
                  ${e.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `;
      } else if (secKey === 'projects') {
        sectionsHtml += `
          <div class="resume-section" style="margin-bottom:14px;">
            <h3 style="font-size:13px; font-weight:bold; border-bottom:1px solid #333; padding-bottom:2px; text-transform:uppercase;">Projects</h3>
            ${projects.map(p => `
              <div style="margin-top:8px;">
                <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:12.5px;">
                  <span>${p.title} [${p.tech}]</span>
                  <span>${p.date}</span>
                </div>
                <ul style="margin-left:20px; font-size:11px; line-height:1.5;">
                  ${p.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        `;
      } else if (secKey === 'skills') {
        sectionsHtml += `
          <div class="resume-section" style="margin-bottom:14px;">
            <h3 style="font-size:13px; font-weight:bold; border-bottom:1px solid #333; padding-bottom:2px; text-transform:uppercase;">Technical Skills</h3>
            <div style="font-size:11px; line-height:1.6; margin-top:4px;">
              <strong>Languages & Systems:</strong> ${skills.languages}<br>
              <strong>Frameworks:</strong> ${skills.frameworks}<br>
              <strong>Core Competencies:</strong> ${skills.specializations}
            </div>
          </div>
        `;
      } else if (secKey === 'education') {
        sectionsHtml += `
          <div class="resume-section" style="margin-bottom:14px;">
            <h3 style="font-size:13px; font-weight:bold; border-bottom:1px solid #333; padding-bottom:2px; text-transform:uppercase;">Education</h3>
            ${education.map(ed => `
              <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-top:4px;">
                <span><strong>${ed.school}</strong>, ${ed.degree}</span>
                <span>${ed.dates} | ${ed.score}</span>
              </div>
            `).join('')}
          </div>
        `;
      }
    });

    resumeDocument.innerHTML = `
      <div class="tech-header">
        <h1>${personal.fullName}</h1>
        <div class="tech-contact">
          <span>${personal.email}</span> |
          <span>${personal.phone}</span> |
          <span>${personal.linkedin}</span> |
          <span>${personal.github}</span>
        </div>
      </div>
      <div style="margin-top:12px;">
        <p style="font-size:11px; line-height:1.5; margin-bottom:12px;">${personal.summary}</p>
        ${sectionsHtml}
      </div>
    `;
  }

  // --- EXPORT PDF (NATIVE PRINT TO PDF FOR 100% SELECTABLE TEXT) ---
  // Small hint: "export using the browser's Print to PDF so the text stays selectable."
  function handleExportPdf() {
    window.print();
  }

  // --- SAVE & LOAD JSON ---
  function handleExportJson() {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      currentTemplate,
      sectionOrder,
      resumeData
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${resumeData.personal.fullName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImportJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.resumeData) {
          resumeData = parsed.resumeData;
          sectionOrder = parsed.sectionOrder || sectionOrder;
          currentTemplate = parsed.currentTemplate || currentTemplate;
          templateSelect.value = currentTemplate;
          bindPersonalInputs();
          bindSkillsInputs();
          renderSectionOrderChips();
          renderDynamicFormLists();
          updateLivePreview();
          saveState();
          alert('Resume data successfully restored from JSON file!');
        }
      } catch (err) {
        alert('Invalid resume JSON file format.');
      }
    };
    reader.readAsText(file);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
