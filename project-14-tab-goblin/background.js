// Tab Goblin Background Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Goblin Service Worker Active.');
});

// Periodic idle tab check (every 30 mins)
chrome.alarms.create('goblinCheck', { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'goblinCheck') {
    chrome.tabs.query({ active: false, pinned: false }, (tabs) => {
      // Background memory monitor
      console.log(`Tab Goblin checked ${tabs.length} inactive tabs.`);
    });
  }
});
