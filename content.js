// Inform the background page that
// this tab should have a page-action
chrome.runtime.sendMessage({
  from:    'keep-content',
  command: 'showPageAction'
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.from === 'keep-bg') {
        if (request.url.indexOf('#LIST') !== -1) {
            sendResponse({
                command: 'addToHistoryAndSetCurrentUrl',
                url: request.url
            });
        } else {
            sendResponse({
                command: 'setTemporaryUrl',
                url: request.url
            });
        }
    }
    //here we get the new
});

Mousetrap.bind(['ctrl+['], (e, combo) => {
  showHistoryPopup();
});

Mousetrap.bind(['ctrl'], (e, combo) => {
  closeHistoryPopup();
}, 'keyup');

Mousetrap.bind(['ctrl+x'], (e, combo) => {
    console.log('Combo ' + combo);
    chrome.runtime.sendMessage({
        from: 'keep-content',
        command: 'goBackInHistory'
    }, function(response) {
        location.href = response.url;
    });
});

Mousetrap.stopCallback = (e, el, combo) => false; // Should be only for defined combinations, not for everything

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
