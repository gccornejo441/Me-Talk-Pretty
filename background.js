chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['scripts/content.js']
  });
});


chrome.runtime.onMessage.addListener( // this is the message listener
    function(request, sender, sendResponse) {
      console.log(`****** request message: ${request}`)
            runThisFunction(request);
    }
);

function runThisFunction(msg) {
  console.log("**********MESSAGED RECEIVED!")
  console.log(`**************Here is your message ${msg}`)
}