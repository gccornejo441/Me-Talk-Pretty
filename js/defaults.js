const extensionAPI = (typeof chrome !== 'undefined') ? chrome : browser;


function getBrowser() {
    if (/Opera|OPR\//.test(navigator.userAgent)) return 'opera';
    if (/firefox/i.test(navigator.userAgent)) return 'firefox';
    return 'chrome';
  }

  
  function reddenPage() {
    document.addEventListener('mouseup', function(event) {
      var selectedText = window.getSelection().toString();
      extensionAPI.runtime.sendMessage({text: selectedText});
  });
  }

  

  extensionAPI.action.onClicked.addListener((tab) => {
      extensionAPI.scripting.executeScript({
        target: {tabId: tab.id},
        function: reddenPage
      });
    
  });

