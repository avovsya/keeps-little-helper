var shortcutActive = false;
var selectedItemIndex;
var noteHistory;

function getHistory(cb) {
    sendCommandToBackground('getHistory', {}, function(response) {
        noteHistory = response.history;
        selectedItemIndex = _.findIndex(noteHistory, (i) => i.current);
        cb();
    });
}

function goBackOneItemInHistory() {
    if (selectedItemIndex === 0) return;

    selectedItemIndex = selectedItemIndex - 1;
}

function goForwardOneItemInHistory() {
    if (selectedItemIndex === (noteHistory.length - 1)) return;

    selectedItemIndex = selectedItemIndex + 1;
}

function redirectToItem(item) {
    sendCommandToBackground('goToId', { id: item.id }, function(response) {
        if (response.url) {
            location.href = response.url;
        }
    });
}

Mousetrap.bind('ctrl', (e, combo) => {
    shortcutActive = false;
    hideHistoryPopup();
    redirectToItem(noteHistory[selectedItemIndex]);
}, 'keyup');

Mousetrap.bind(['ctrl+['], (e, combo) => {
    if (!shortcutActive) {
        shortcutActive = true;
        showHistoryPopup();
        getHistory(function () {
            goBackOneItemInHistory();
            drawHistoryIntoModal(noteHistory, selectedItemIndex);
        })
    } else {
        goBackOneItemInHistory();
        drawHistoryIntoModal(noteHistory, selectedItemIndex);
    }
});

Mousetrap.bind(['ctrl+]'], (e, combo) => {
    if (!shortcutActive) {
        shortcutActive = true;
        showHistoryPopup();
        getHistory(function () {
            goForwardOneItemInHistory();
            drawHistoryIntoModal(noteHistory, selectedItemIndex);
        })
    } else {
        goForwardOneItemInHistory();
        drawHistoryIntoModal(noteHistory, selectedItemIndex);
    }
});
