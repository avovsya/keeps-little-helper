// Inform the background page that 
// this tab should have a page-action

Mousetrap.prototype.stopCallback = (e, el, combo) => false; // Should be only for defined combinations, not for everything

sendCommandToBackground('showPageAction', {});

function sendCommandToBackground(command, data, responseCb) {
    chrome.runtime.sendMessage({
        from: 'keep-content',
        command: command,
        data: data
    }, responseCb);
}

// Handle URL change
// If new URL points to a note -> issue command for bg script to add it to history
// Otherwise -> do nothing
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.from === 'keep-bg') {
        if (request.url.indexOf('#LIST') !== -1 ||
            request.url.indexOf('#NOTE') !== -1) {
            sendCommandToBackground('addUrlToHistory', {
                url: request.url,
                meta: { noteTitle: getNoteTitle() }
            });
        } 
    }
});

function goToId(id) {
    sendCommandToBackground('goToId', { id: id });
}

function getNoteTitle() {
  var pins = document.querySelectorAll('[aria-pressed][tabindex="0"] svg');
  var editables = pins[pins.length-1].parentNode.parentElement.querySelectorAll('[contenteditable]');

  if (!editables || editables.length === 0) {
  }

  for (var i = 0; i < editables.length; i++) {
    if (editables[i].textContent && editables[i].textContent.length > 0) {
      return editables[i].textContent;
    }
  }

  return window.location.href;
}

// var ctrlComboActive;

// Mousetrap.bind(['ctrl+[', 'ctrl+]'], (e, combo) => {
//     console.log('Combo ' + combo);
//     ctrlComboActive = combo;
// });

// Mousetrap.bind(['ctrl'], (e, combo) => {
//     if (ctrlComboActive) {
//         console.log('Combo released ' + ctrlComboActive);
//         ctrlComboActive = false;
//     }
// }, 'keyup');