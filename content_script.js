chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "getHighlightedText") {
      var highlightedText = window.getSelection().toString();
      chrome.runtime.sendMessage({ action: "sendHighlightedText", highlightedText: highlightedText });
    }
  });
  