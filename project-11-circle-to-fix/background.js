// Circle to Fix Background Service Worker
chrome.commands.onCommand.addListener((command) => {
  if (command === 'activate-circle-to-fix') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_DRAWING' });
      }
    });
  }
});
