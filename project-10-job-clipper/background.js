// Job Clipper Background Alarm Service Worker
chrome.runtime.onInstalled.addListener(() => {
  // Set alarm for daily deadline check
  chrome.alarms.create('checkDeadlines', { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkDeadlines') {
    chrome.storage.local.get(['jobClipper_cards'], (res) => {
      const cards = res.jobClipper_cards || [];
      const now = new Date();
      cards.forEach(c => {
        if (c.deadline) {
          const diff = Math.ceil((new Date(c.deadline) - now) / (1000 * 60 * 60 * 24));
          if (diff <= 2 && diff >= 0) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'icon.png',
              title: `Deadline Alert: ${c.role}`,
              message: `Application for ${c.company} is due in ${diff} day(s)!`
            });
          }
        }
      });
    });
  }
});
