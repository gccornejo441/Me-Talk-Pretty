(() => {
  // chrome.runtime.sendMessage({ action: "copyPage" });

  // chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  //   log("Got message from background page: " + msg);
  // });


  
  
})()
var copy = function(text) {

  console.log(`***************: ${text} is ZERO`)
  $('#clipboard_area').text("Hi this is static text")[0].select();
  document.execCommand('Copy');
}

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

var text = ""
var url = ""

// Listener 1
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(`*******************message from background script:  ${message}`)
  if (!message.text && !message.url) {
    console.log("Listener 1 received message for action A");

    text = message.text;
    url = message.url

    copy("[" + text + "](" + url + ")");
    // Perform actions specific to action A
  } else {
    console.log("Listener 1 received message:", message);
    copy("[" + text + "]");
    // Perform default actions for other message types
  }
});