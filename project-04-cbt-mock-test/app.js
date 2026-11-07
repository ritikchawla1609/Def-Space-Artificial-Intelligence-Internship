// CBT Mock Test Engine — National Examination Simulator
// Bharat Space Education Research Centre - GenAI Internship (Week 2, Project 4)

(function () {
  'use strict';

  // Exam Configuration & State
  let examData = null;
  let activeQuestionIndex = 0;
  let activeSubject = 'Physics';
  let timerInterval = null;
  let timeRemaining = 45 * 60; // seconds
  let isExamSubmitted = false;

  // Candidate progress per question:
  // { status, selectedOption, timeSpentSeconds, visited }
  let candidateAnswers = [];

  // DOM Elements
  const examTitleText = document.getElementById('examTitleText');
  const timerDisplay = document.getElementById('timerDisplay');
  const subjectTabsContainer = document.getElementById('subjectTabsContainer');
  const examFileSelect = document.getElementById('examFileSelect');
  const customExamFile = document.getElementById('customExamFile');
  const btnResetTest = document.getElementById('btnResetTest');

  const qNumberText = document.getElementById('qNumberText');
  const markingSchemeText = document.getElementById('markingSchemeText');
  const questionTextEl = document.getElementById('questionTextEl');
  const optionsContainer = document.getElementById('optionsContainer');

  const btnPrevQ = document.getElementById('btnPrevQ');
  const btnSaveNext = document.getElementById('btnSaveNext');
  const btnMarkReview = document.getElementById('btnMarkReview');
  const btnClearResponse = document.getElementById('btnClearResponse');
  const btnSubmitTest = document.getElementById('btnSubmitTest');

  const paletteSubjectName = document.getElementById('paletteSubjectName');
  const paletteGrid = document.getElementById('paletteGrid');
  const countAnswered = document.getElementById('countAnswered');
  const countNotAnswered = document.getElementById('countNotAnswered');
  const countMarked = document.getElementById('countMarked');
  const countMarkedAns = document.getElementById('countMarkedAns');
  const countNotVisited = document.getElementById('countNotVisited');

  // Result Elements
  const resultScreen = document.getElementById('resultScreen');
  const resTotalScore = document.getElementById('resTotalScore');
  const resMaxScore = document.getElementById('resMaxScore');
  const resCorrectCount = document.getElementById('resCorrectCount');
  const resIncorrectCount = document.getElementById('resIncorrectCount');
  const resUnattemptedCount = document.getElementById('resUnattemptedCount');
  const resAccuracy = document.getElementById('resAccuracy');
  const handCalcEquation = document.getElementById('handCalcEquation');
  const resultTableBody = document.getElementById('resultTableBody');
  const btnRetakeTest = document.getElementById('btnRetakeTest');

  // --- INITIALIZATION ---
  async function init() {
    setupEventListeners();
    const loadedFromStorage = loadSavedProgress();
    if (!loadedFromStorage) {
      await loadExamFile(examFileSelect.value);
    }
  }

  function setupEventListeners() {
    examFileSelect.addEventListener('change', async (e) => {
      try { localStorage.removeItem('cbt_exam_state'); } catch (err) {}
      await loadExamFile(e.target.value);
    });

    customExamFile.addEventListener('change', handleCustomFile);
    btnResetTest.addEventListener('click', resetExamState);

    btnPrevQ.addEventListener('click', () => navigateToQuestion(activeQuestionIndex - 1));
    btnSaveNext.addEventListener('click', handleSaveAndNext);
    btnMarkReview.addEventListener('click', handleMarkForReviewAndNext);
    btnClearResponse.addEventListener('click', handleClearResponse);
    btnSubmitTest.addEventListener('click', () => {
      if (confirm('Are you sure you want to submit your examination now?')) {
        submitExam();
      }
    });

    btnRetakeTest.addEventListener('click', () => {
      resetExamState();
      resultScreen.style.display = 'none';
    });
  }

  // --- LOAD EXAM DATA ---
  async function loadExamFile(filename) {
    // 1. Try bundled offline datasets first for instantaneous zero-latency loading
    if (window.EMBEDDED_EXAMS && window.EMBEDDED_EXAMS[filename]) {
      setupExam(JSON.parse(JSON.stringify(window.EMBEDDED_EXAMS[filename])));
      return;
    }

    // 2. Fall back to fetch if served over HTTP/HTTPS
    try {
      const res = await fetch(filename);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setupExam(data);
    } catch (e) {
      console.warn('Network fetch unavailable:', e.message);
      // Fallback check
      if (window.EMBEDDED_EXAMS) {
        const fallbackKey = Object.keys(window.EMBEDDED_EXAMS)[0];
        if (fallbackKey) {
          setupExam(JSON.parse(JSON.stringify(window.EMBEDDED_EXAMS[fallbackKey])));
          return;
        }
      }
      alert('Could not load examination file: ' + filename);
    }
  }

  function handleCustomFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error('Exam file must contain a non-empty "questions" array.');
        }
        localStorage.removeItem('cbt_exam_state');
        setupExam(data);
      } catch (err) {
        alert('Invalid CBT Exam JSON format: ' + err.message);
      }
    };
    reader.onerror = () => alert('Failed to read selected JSON file.');
    reader.readAsText(file);
  }

  function setupExam(data) {
    if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
      alert('Examination data is invalid or contains no questions.');
      return;
    }
    examData = data;
    examTitleText.textContent = data.examTitle || 'National CBT Mock Examination 2026';
    timeRemaining = (data.durationMinutes || 45) * 60;
    activeQuestionIndex = 0;
    activeSubject = (data.subjects && data.subjects.length > 0) ? data.subjects[0] : (data.questions[0].subject || 'General');
    isExamSubmitted = false;

    // Initialize answer status for all questions
    candidateAnswers = data.questions.map(() => ({
      status: 'not-visited',
      selectedOption: null,
      timeSpentSeconds: 0,
      visited: false
    }));

    // Mark first question visited
    if (candidateAnswers.length > 0) {
      candidateAnswers[0].visited = true;
      candidateAnswers[0].status = 'not-answered';
    }

    renderSubjectTabs();
    renderQuestion(activeQuestionIndex);
    renderPalette();
    startTimer();
    saveProgress();
  }

  // --- PERSISTENCE: LOCALSTORAGE ---
  // Requirement: "A refresh mid-test loses nothing, including the timer."
  function saveProgress() {
    if (isExamSubmitted || !examData) return;
    const state = {
      examData,
      activeQuestionIndex,
      activeSubject,
      timeRemaining,
      candidateAnswers,
      savedAt: Date.now()
    };
    try {
      localStorage.setItem('cbt_exam_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save progress to localStorage:', e);
    }
  }

  function loadSavedProgress() {
    try {
      const saved = localStorage.getItem('cbt_exam_state');
      if (!saved) return false;
      const state = JSON.parse(saved);
      if (state.examData && state.candidateAnswers) {
        examData = state.examData;
        examTitleText.textContent = examData.examTitle;
        activeQuestionIndex = state.activeQuestionIndex || 0;
        activeSubject = state.activeSubject || examData.subjects[0];
        timeRemaining = Math.max(0, state.timeRemaining);
        candidateAnswers = state.candidateAnswers;
        isExamSubmitted = false;

        renderSubjectTabs();
        renderQuestion(activeQuestionIndex);
        renderPalette();
        startTimer();
        return true;
      }
    } catch (e) {
      console.warn('Could not restore state from storage', e);
    }
    return false;
  }

  function resetExamState() {
    try {
      localStorage.removeItem('cbt_exam_state');
    } catch (e) {}
    clearInterval(timerInterval);
    loadExamFile(examFileSelect.value);
  }

  // --- TIMER ENGINE ---
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        if (candidateAnswers[activeQuestionIndex]) {
          candidateAnswers[activeQuestionIndex].timeSpentSeconds++;
        }
        updateTimerDisplay();
        saveProgress();
      } else {
        clearInterval(timerInterval);
        alert('Time up! Your examination is being auto-submitted.');
        submitExam();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (timeRemaining < 300) {
      timerDisplay.style.color = '#ef4444'; // Red under 5 mins
    } else {
      timerDisplay.style.color = '#38bdf8';
    }
  }

  // --- SUBJECT STRIP ---
  function renderSubjectTabs() {
    subjectTabsContainer.innerHTML = '';
    examData.subjects.forEach(sub => {
      const btn = document.createElement('button');
      btn.className = `subject-tab ${sub === activeSubject ? 'active' : ''}`;
      btn.textContent = sub;
      btn.addEventListener('click', () => {
        activeSubject = sub;
        renderSubjectTabs();
        // Jump to first question of this subject
        const firstIdx = examData.questions.findIndex(q => q.subject === sub);
        if (firstIdx !== -1) {
          navigateToQuestion(firstIdx);
        }
      });
      subjectTabsContainer.appendChild(btn);
    });
  }

  // --- RENDER QUESTION ---
  function renderQuestion(index) {
    if (index < 0 || index >= examData.questions.length) return;
    activeQuestionIndex = index;
    const q = examData.questions[index];

    // Update active subject tab if needed
    if (q.subject !== activeSubject) {
      activeSubject = q.subject;
      renderSubjectTabs();
    }

    // Mark as visited
    const prog = candidateAnswers[index];
    prog.visited = true;
    if (prog.status === 'not-visited') {
      prog.status = 'not-answered';
    }

    qNumberText.textContent = `Question ${index + 1} of ${examData.questions.length}`;
    markingSchemeText.innerHTML = `
      <span class="badge-pos">+${examData.positiveMarks} for Right</span>
      <span class="badge-neg">-${examData.negativeMarks} for Wrong</span>
    `;

    questionTextEl.textContent = q.question;

    // Render Options
    optionsContainer.innerHTML = '';
    q.options.forEach((optText, optIdx) => {
      const card = document.createElement('label');
      card.className = `option-card ${prog.selectedOption === optIdx ? 'selected' : ''}`;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `opt_q_${index}`;
      radio.className = 'option-radio';
      radio.value = optIdx;
      radio.checked = prog.selectedOption === optIdx;

      radio.addEventListener('change', () => {
        prog.selectedOption = optIdx;
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        saveProgress();
      });

      const lbl = document.createElement('span');
      lbl.className = 'option-label';
      lbl.innerHTML = `<strong>${String.fromCharCode(65 + optIdx)}.</strong> ${optText}`;

      card.appendChild(radio);
      card.appendChild(lbl);
      optionsContainer.appendChild(card);
    });

    // Disable Prev button if first question
    btnPrevQ.disabled = index === 0;

    renderPalette();
    saveProgress();
  }

  // --- NAVIGATION & ACTIONS ---
  function navigateToQuestion(newIndex) {
    if (newIndex >= 0 && newIndex < examData.questions.length) {
      renderQuestion(newIndex);
    }
  }

  function handleSaveAndNext() {
    const prog = candidateAnswers[activeQuestionIndex];
    if (prog.selectedOption !== null) {
      prog.status = 'answered';
    } else {
      prog.status = 'not-answered';
    }

    if (activeQuestionIndex < examData.questions.length - 1) {
      navigateToQuestion(activeQuestionIndex + 1);
    } else {
      renderPalette();
      saveProgress();
    }
  }

  function handleMarkForReviewAndNext() {
    const prog = candidateAnswers[activeQuestionIndex];
    if (prog.selectedOption !== null) {
      prog.status = 'marked-answered';
    } else {
      prog.status = 'marked';
    }

    if (activeQuestionIndex < examData.questions.length - 1) {
      navigateToQuestion(activeQuestionIndex + 1);
    } else {
      renderPalette();
      saveProgress();
    }
  }

  function handleClearResponse() {
    const prog = candidateAnswers[activeQuestionIndex];
    prog.selectedOption = null;
    prog.status = 'not-answered';
    renderQuestion(activeQuestionIndex);
  }

  // --- QUESTION PALETTE ---
  function renderPalette() {
    paletteSubjectName.textContent = activeSubject;
    paletteGrid.innerHTML = '';

    let answered = 0, notAnswered = 0, marked = 0, markedAns = 0, notVisited = 0;

    examData.questions.forEach((q, idx) => {
      const prog = candidateAnswers[idx];

      // Tally statuses
      if (prog.status === 'answered') answered++;
      else if (prog.status === 'not-answered') notAnswered++;
      else if (prog.status === 'marked') marked++;
      else if (prog.status === 'marked-answered') markedAns++;
      else notVisited++;

      // Palette button
      const btn = document.createElement('button');
      btn.className = `palette-btn status-${prog.status} ${idx === activeQuestionIndex ? 'active-q' : ''}`;
      btn.textContent = idx + 1;
      btn.title = `Question ${idx + 1} (${q.subject}): ${prog.status}`;
      btn.addEventListener('click', () => navigateToQuestion(idx));
      paletteGrid.appendChild(btn);
    });

    countAnswered.textContent = answered;
    countNotAnswered.textContent = notAnswered;
    countMarked.textContent = marked;
    countMarkedAns.textContent = markedAns;
    countNotVisited.textContent = notVisited;
  }

  // --- SUBMISSION & RESULTS ---
  // Requirement: "The score matches your hand calculation for 15 questions."
  function submitExam() {
    isExamSubmitted = true;
    clearInterval(timerInterval);
    try { localStorage.removeItem('cbt_exam_state'); } catch (err) {}

    const totalQuestions = examData.questions.length;
    const pos = examData.positiveMarks;
    const neg = examData.negativeMarks;
    const maxScore = totalQuestions * pos;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    resultTableBody.innerHTML = '';

    examData.questions.forEach((q, idx) => {
      const prog = candidateAnswers[idx];
      const isAttempted = prog.selectedOption !== null;
      const isCorrect = isAttempted && prog.selectedOption === q.correct;

      let marksAwarded = 0;
      let resultText = '';
      let badgeClass = '';

      if (isAttempted) {
        if (isCorrect) {
          correctCount++;
          marksAwarded = pos;
          resultText = 'Correct';
          badgeClass = 'text-success';
        } else {
          incorrectCount++;
          marksAwarded = -neg;
          resultText = 'Incorrect';
          badgeClass = 'text-danger';
        }
      } else {
        unattemptedCount++;
        marksAwarded = 0;
        resultText = 'Unattempted';
        badgeClass = 'text-muted';
      }

      // Add row to result table
      const row = document.createElement('tr');
      const timeSpentStr = `${prog.timeSpentSeconds}s`;
      const selectedStr = isAttempted ? `${String.fromCharCode(65 + prog.selectedOption)} (${q.options[prog.selectedOption]})` : '—';
      const correctStr = `${String.fromCharCode(65 + q.correct)} (${q.options[q.correct]})`;

      row.innerHTML = `
        <td><strong>${idx + 1}</strong></td>
        <td>${q.subject}</td>
        <td>${selectedStr}</td>
        <td><strong>${correctStr}</strong></td>
        <td class="${badgeClass}"><strong>${resultText}</strong></td>
        <td>${marksAwarded > 0 ? '+' + marksAwarded : marksAwarded}</td>
        <td>${timeSpentStr}</td>
      `;
      resultTableBody.appendChild(row);
    });

    // Exact Hand Calculation Formula:
    const calculatedScore = (correctCount * pos) - (incorrectCount * neg);
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? ((correctCount / attemptedCount) * 100).toFixed(1) : '0.0';

    resTotalScore.textContent = calculatedScore;
    resMaxScore.textContent = maxScore;
    resCorrectCount.textContent = correctCount;
    resIncorrectCount.textContent = incorrectCount;
    resUnattemptedCount.textContent = unattemptedCount;
    resAccuracy.textContent = `${accuracy}%`;

    // Hand calculation verification text
    handCalcEquation.innerHTML = `
      Verified Formula: (${correctCount} Correct × ${pos}) - (${incorrectCount} Incorrect × ${neg}) = ${correctCount * pos} - ${incorrectCount * neg} = <strong>${calculatedScore} Marks</strong>
    `;

    resultScreen.style.display = 'flex';
  }

  window.addEventListener('DOMContentLoaded', init);
})();
