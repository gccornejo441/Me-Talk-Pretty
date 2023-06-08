(() => {

  const cleanBtn = document.getElementById('copyButton')
  const contentTB = document.getElementById('inputText');

/**
 * Copies the provided text to the clipboard.
 *
 * @param {string} textToCopy - The text to be copied to the clipboard.
 * @returns {Promise<void>} - A Promise that resolves when the text is successfully copied, or rejects if there is an error.
 */
async function copy(textToCopy) {
  try {
    chrome.action.setBadgeText({ text: 'CLIP!' });
    await navigator.clipboard.writeText(textToCopy)
    // Successful copy, no additional action needed.
  } catch (error) {
    console.error('Unable to copy text:', error);
    throw error; // Re-throw the error to handle it at the caller's end if needed.
  }
}



cleanBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    let contentTBValue = contentTB.value
    if (contentTBValue) {
        setTimeout(() => {
            alert('Cleaning, please wait.')
            copy(contentTBValue)
        }, 500)
        return;
    }
    alert('Nothing to clean. Try typing something in the textbox.')
})

  
})()

