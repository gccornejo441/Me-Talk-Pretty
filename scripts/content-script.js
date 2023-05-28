document.addEventListener('mouseup', function(event) {
  const selectedText = window.getSelection().toString();
  if (selectedText != '') {
    chrome.runtime.sendMessage(selectedText, function (response) {
      console.log('received user data', response);
  });
  }
});





