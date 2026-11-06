// Job Clipper Content Script
// Extracts Role, Company, URL, Deadline from Job Board DOMs
(function () {
  'use strict';

  function extractJobDetails() {
    let role = '';
    let company = '';
    let deadline = '';

    // 1. Check OpenGraph / Meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
    const ogSite = document.querySelector('meta[property="og:site_name"]')?.content;

    // 2. LinkedIn Job Selectors
    const liTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title, .top-card-layout__title');
    const liCompany = document.querySelector('.job-details-jobs-unified-top-card__company-name, .topcard__org-name-link');

    // 3. Indeed Job Selectors
    const indTitle = document.querySelector('.jobsearch-JobInfoHeader-title');
    const indCompany = document.querySelector('[data-company-name="true"]');

    // 4. Naukri / Internshala Selectors
    const genTitle = document.querySelector('h1, .heading_4_5, .job-title');
    const genCompany = document.querySelector('.company-name, .link_display_like_text, .employer');

    role = (liTitle || indTitle || genTitle)?.innerText?.trim() || ogTitle || document.title.split('-')[0].trim();
    company = (liCompany || indCompany || genCompany)?.innerText?.trim() || ogSite || 'Hiring Organization';

    // Heuristic deadline detection
    const pageText = document.body.innerText;
    const match = pageText.match(/deadline[:\s]+(\d{1,2}\s+[a-zA-Z]+|\d{4}-\d{2}-\d{2})/i);
    if (match) {
      deadline = match[1];
    } else {
      // Default to 7 days from today
      const d = new Date();
      d.setDate(d.getDate() + 7);
      deadline = d.toISOString().split('T')[0];
    }

    return { role, company, deadline, url: window.location.href };
  }

  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'EXTRACT_JOB_DETAILS') {
        sendResponse(extractJobDetails());
      }
      return true;
    });
  }
})();
