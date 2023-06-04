let lastRequest = {};

async function copyPage() {
  console.log("Im inside of copypage line:4");
  // const [tab] = await chrome.tabs.query({ active: true });
  // console.log(tab.id);
  // chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
}

function backgroundSendAssets(text, url) {
  console.log(`***************tab: ${text}`);
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
      var tabId = tabs[0].id;
      chrome.tabs.sendMessage(
        tabId,
        { text: text, url: url },
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
}

function onClickHandler(target, tab) {
  console.log(`***************lastRequest.action:, ${JSON.stringify(lastRequest)}`);

  switch (lastRequest.action) {
    case "copyPage":
      console.log("Im inside of copypage line: 13");
      copyPage();
      break;

    case "copyElement":
      var url = target.linkUrl;
      var text = target.selectionText || lastRequest.text;
      console.log(`***************message.TEXT: ${JSON.stringify(text)}`);
      console.log(`***************message.url: ${!url}`);

      if (!url && !text && !target.linkUrl) {
        copyPage();
        break;
      }

      if (!target.linkUrl) {
        copyPage();
        break;
      }

      text = "![](" + target.linkUrl + ")";
      console.log(`***************message.TEXT2: ${JSON.stringify(text)}`);

      if (url) {
        backgroundSendAssets(text, url)
      } else {
        backgroundSendAssets(text)
      }
      break;

    case "copySelection":
      var str = "";
      var links = lastRequest.links;

      for (var i = 0; i < links.length; i++) {
      console.log(`***************message.links at 70: ${JSON.stringify(links)}`);

        var link = links[i];
        var text = link.text;

        if (link.src) {
          text = "![](" + link.src + ")";
        }

        str += "- [" + text + "](" + (link.href || "") + ")\n";
      }

      backgroundSendAssets(str)
      break;

  }
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "menuOption") {

    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs) {
        var tabId = tabs[0].id;
        chrome.tabs.sendMessage(
          tabId,
          { action: info.menuItemId },
          function (response) {
            // Handle the response from the content script
            console.log("Response from content script:", response);

          }
        );
      }
    );
    // onClickHandler(info, tab);
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
