(() => {
  // chrome.runtime.sendMessage({ action: "copyPage" });

  // chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  //   log("Got message from background page: " + msg);
  // });


  
  
})()

var copy = function(text) {
  const textAreaInput = document.getElementById("clipboard_area")
  console.log(`*************** selected text in copy: ${text}`)
  textAreaInput.value = text
  textAreaInput.focus()
  textAreaInput.select()
    document.execCommand('Copy');
  }
  
  document.addEventListener("DOMContentLoaded", function(evn) {
    console.log(evn)
  })

  function gatherAssets() {
    console.log("context menu 24")
    document.addEventListener("contextmenu", async function (event) {
      var selection = window.getSelection();
    
      var linksInSelection = 0;
      var text;
      if (selection.rangeCount == 0) {
        console.log(`***************: ${selection.rangeCount} is ZERO`)
        text = $(event.target).text() || $(event.target).parent().text()
      } else {
        console.log(`***************selection.rangeCount is: ${selection.rangeCount}`)
        var clonedSelection = selection.getRangeAt(0).cloneContents();
        var div = document.createElement('div');
        div.appendChild(clonedSelection);
        linksInSelection = $('a[href]', div);
      }
    
      if (linksInSelection.length > 0) {
        console.log(`***************LinksInSelection: ${linksInSelection.length}`)
    
        links = [];
        linksInSelection.each(function() {
          links.push({
            href: $(this).prop('href'),
            text: $(this).text(),
            src:  $(this).find('img').attr('src')
          });
        });
        console.log("here")
        await chrome.runtime.sendMessage({ action: "copySelection", links: links }, function (response) {
          // Handle the response from the content script
          console.log("Response from content script:", response);
        });
      } else {
        console.log(`************ Text 57: ${text}`)
        if (text) {
          await chrome.runtime.sendMessage({ action: "copyElement", text: text },
          function (response) {
            // Handle the response from the content script
            console.log("Response from copyElement 61:", response);
          });
        } else {
          console.log(`************ No Text: ${text}`)
        }
      }
    }, true);
  }

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(`*******************Listening for context menu:  ${message.action}`)
    if (message.action === "menuOption") {
      gatherAssets()
    } 
    sendResponse("Gather Assest Executed!")
  });

// window.addEventListener('keydown', function(event) {
//   // Command + Ctrl + C
//   if (!(event.keyCode == 67 && event.metaKey && event.ctrlKey)) { return; }
//   chrome.runtime.sendMessage({ action: "copyPage" });
// }, true);



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(`*******************Listening for context menu message 82:  ${JSON.stringify(message)}`)

  // Check if the message contains the expected data
  if (message.tabTitle && message.tabUrl) {
    // Access the received data
    var tabTitle = message.tabTitle;
    var tabUrl = message.tabUrl;

    // Perform actions with the received data
    console.log("Received tab title:", tabTitle);
    console.log("Received tab URL:", tabUrl);

    // Send a response back if needed
    var response = "Message received in content script";
    sendResponse(response);
  }
});
