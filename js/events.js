extensionAPI.runtime.onInstalled.addListener(() => {
    installContextMenus()
})

if (getBrowser() == "firefox") extensionAPI.runtime.onStartup.addListener(installContextMenus)


function installContentScripts() {
    extensionAPI.scripting.registerContentScripts([{
      matches: ["https://docs.google.com/document/*"],
      id: "google-docs",
      js: ["js/page/google-doc.js"],
      runAt: "document_start",
      world: "MAIN"
    }])
    .then(() => console.info("Installed content scripts"), console.error)
  }

function installContextMenus() {
    if (extensionAPI.contextMenus)
    extensionAPI.contextMenus.create({
      id: "read-selection",
      title: extensionAPI.i18n.getMessage("context_read_selection"),
      contexts: ["selection"]
    },
    function() {
      if (extensionAPI.runtime.lastError) console.error(extensionAPI.runtime.lastError)
      else console.info("Installed context menus")
    })
  }

  if (extensionAPI.contextMenus)
  extensionAPI.omnibox.onInputEntered.addListener((text) => {
    const newURL = 'http://www.google.com/search?q=' + encodeURLComponent(text);
    chrome.tabs.create({ url: newURL });
  })
  else {
    alert("Checkin")
    console.log("What is good?")
  }    


  