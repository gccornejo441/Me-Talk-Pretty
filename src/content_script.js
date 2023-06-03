(() => {
  // chrome.runtime.sendMessage({ action: "copyPage" });

  // chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  //   log("Got message from background page: " + msg);
  // });


  
  
})()

window.addEventListener('keydown', function(event) {
  // Command + Ctrl + C
  if (!(event.keyCode == 67 && event.metaKey && event.ctrlKey)) { return; }
  chrome.runtime.sendMessage({ action: "copyPage" });
}, true);

document.addEventListener("contextmenu", async function (event) {
  var selection = window.getSelection();

  var linksInSelection = 0;
  var text;
  if (selection.rangeCount == 0) {
    console.log(`***************: ${selection.rangeCount} is ZERO`)
    text = $(event.target).text() || $(event.target).parent().text()
  } else {
    console.log(`***************: ${selection.rangeCount}`)
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
    await chrome.runtime.sendMessage({ action: "copyElement", text: text });
  }
}, true);


// Listener 1
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(`*******************message from background script:  ${message}`)
  if (message.type === "hello") {
    console.log("Listener 1 received message for action A");
    // Perform actions specific to action A
  } else {
    console.log("Listener 1 received message:", message);
    // Perform default actions for other message types
  }
});