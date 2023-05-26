  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/content.js"]
    });
  });



  // Example of a simple user data object
const user = {
    username: 'demo-user'
  };
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    console.log(message)
    if (message === 'get-user-data') {
      sendResponse(user);
    }
  });