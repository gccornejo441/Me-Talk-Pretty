(() => {
  // chrome.runtime.sendMessage({ action: "copyPage" });

  // chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  //   log("Got message from background page: " + msg);
  // });


  
  
})()



var copy = function(text) {
  var value = $('#clipboard_area').text(text)
  console.log(`*************** copy from value: ${value}`)

    $('#clipboard_area').text(text)[0].select();
    document.execCommand('Copy');
  }

  function gatherAssets() {
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
        await chrome.runtime.sendMessage({ action: "copySelection", links: links });
      } else {
        if (text) {
          await chrome.runtime.sendMessage({ action: "copyElement", text: text });
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
  });

window.addEventListener('keydown', function(event) {
  // Command + Ctrl + C
  if (!(event.keyCode == 67 && event.metaKey && event.ctrlKey)) { return; }
  chrome.runtime.sendMessage({ action: "copyPage" });
}, true);


var text = ""
var url = ""

// Listener 1
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(`*******************message from background script:  ${JSON.stringify(message)}`)
  if (!message.text && !message.url) {
    console.log("Listener 1 received message for action A");

    copy("Try Again")
    console.log(`********${message.text}*********${message.url}************`)

    // copy("[" + text + "](" + url + ")");
    // Perform actions specific to action A
  } else {
    console.log("Listener 1 received message:", message.text);
    text = message.text;
    url = message.url


    copy(text);
    // Perform default actions for other message types
  }
});