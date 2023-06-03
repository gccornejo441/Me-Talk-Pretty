let lastRequest = {};

async function copyPage() {
  console.log("Im inside of copypage line:4");
  // const [tab] = await chrome.tabs.query({ active: true });
  // console.log(tab.id);
  // chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
}

function onClickHandler(target, tab) {
  console.log(`***************message.action: ${lastRequest.action}`);
  switch (lastRequest.action) {
    case "copyPage":
      console.log("Im inside of copypage line: 13");
      copyPage();
      break;
    case "copyElement":
      var url = target.linkUrl;
      var text = target.selectionText || lastRequest.text;

      if (!url && !text && !target.srcUrl) {
        copyPage();
        break;
      }

      if (!target.srcUrl) {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            var tabId = tabs[0].id;
            chrome.tabs.sendMessage(
              tabId,
              { greeting: "hello" },
              function (response) {
                // Handle the response from the content script
                console.log("Response from content script:", response);

                // Perform actions based on the response
                if (response && response.success) {
                  // Handle successful response
                } else {
                  // Handle unsuccessful response or error
                }
              }
            );
          }
        );

        copy("[" + text + "](" + url + ")");
        break;
      }

      text = "![](" + target.srcUrl + ")";
      if (url) {
        copy("[" + text + "](" + url + ")");
      } else {
        copy(text);
      }
      break;
    case "copySelection":
      var str = "";
      var links = lastRequest.links;
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var text = link.text;
        if (link.src) {
          text = "![](" + link.src + ")";
        }
        str += "- [" + text + "](" + (link.href || "") + ")\n";
      }
      copy(str);
      break;
  }
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "menuOption") {
    console.log("The Context menu has been clicked");
    onClickHandler(info, tab);
  }
});

var menuOptions = {
  id: "menuOption",
  title: "Copy link with markdown-format",
  contexts: ["image", "link", "page", "selection"],
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(menuOptions);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  console.log(`***************message.action: ${message.action}`);

  if (message.action === "copyPage") {
    copyPage();
  } else {
    lastRequest = message;
  }
});
