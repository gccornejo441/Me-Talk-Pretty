// popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.text) {
      document.getElementById('highlightedText').textContent = request.text;

    }
  });
  