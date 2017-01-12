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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.from === 'keep-bg') {
        if (request.url.indexOf('#LIST') !== -1 ||
            request.url.indexOf('#NOTE') !== -1) {
            sendCommandToBackground('addUrlToHistory', {
                url: request.url,
                meta: { noteTitle: getNoteTitle() }
            });
        } else { 
            sendCommandToBackground('addDummyUrlToHistory', { url: request.url });
        }
    }
});

function goToId(id) {
    sendCommandToBackground('goToId', { id: id });
}

// Mousetrap.bind(['ctrl+['], (e, combo) => {
//     console.log('GO BACK');
//     sendCommandToBackground('getHistory', {}, function(response) {
//         console.log('HISTORY: ', response);
//     });
// });

Mousetrap.bind(['ctrl+['], (e, combo) => {
    console.log('GO BACK');
    // sendCommandToBackground('goBack', {}, function(response) {
    //     if (response.url) {
    //         location.href = response.url;
    //     }
    // });

    renderHistoryTemplate({});
});

Mousetrap.bind(['ctrl+]'], (e, combo) => {
    console.log('GO FOWARD');
    sendCommandToBackground('goForward', {}, function(response) {
        if (response.url) {
            location.href = response.url;
        }
    });
});

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