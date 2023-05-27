chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['script/content.js']
  });
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.text) {
    console.log('Received message:', request.text);
    // Additional code to handle the received message
  }
});