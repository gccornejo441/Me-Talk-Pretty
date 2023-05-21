const extensionAPI = (typeof chrome !== 'undefined') ? chrome : browser;


function getBrowser() {
    if (/Opera|OPR\//.test(navigator.userAgent)) return 'opera';
    if (/firefox/i.test(navigator.userAgent)) return 'firefox';
    return 'chrome';
  }
  