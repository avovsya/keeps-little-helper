var modalTimeout;
window.historyUi = {};
(function () {
    $(function () {
        createHistoryModal();
    });

    function getHistory(cb) {
        sendCommandToBackground('getHistory', {}, function (response) {
            var selectedItemIndex = _.findIndex(response.history, (i) => i.current);
            cb(response.history, selectedItemIndex);
        });
    }

    function redirectToItem(item) {
        sendCommandToBackground('goToId', { id: item.id }, function (response) {
            if (response.url) {
                location.href = response.url;
            }
        });
    }

    function goBackOneItemInHistory(state) {
        if (state.historyUi.selectedItemIndex === 0) return;

        state.historyUi.selectedItemIndex -= 1;
    }

    function goForwardOneItemInHistory(state) {
        if (state.historyUi.selectedItemIndex === (state.historyUi.noteHistory.length - 1)) return;

        state.historyUi.selectedItemIndex += 1;
    }

    function createHistoryModal() {
        $("body").append(`
            <div class="keeps-helper keeps-modal keeps-history-modal">
                <div class="keeps-helper keeps-modal-content">
                    <ul class="keeps-history-list">
                    </ul>
                </div>
            </div>`)
    }

    function drawHistoryIntoModal(state) {
        $('.keeps-history-list').html('');
        _.forEach(state.historyUi.noteHistory, (item, i) => {
            $('.keeps-history-list').append(`
          <li class="${ i === state.historyUi.selectedItemIndex ? 'keeps-selected-history-item' : ''}">
            ${item.meta.noteTitle}
          </li>
        `);
        });
    }

    function showHistoryPopup() {
        modalTimeout = setTimeout(function () {
            $('.keeps-history-modal').show();
        }, 200);
    }

    function hideHistoryPopup() {
        clearTimeout(modalTimeout);
        $('.keeps-history-modal').hide();
    }

    historyUi.initState = function (state) {
        state.historyUi = {
            noteHistory: null,
            selectedItemIndex: null,
            active: false
        };
    };

    historyUi.shortcutBackwards = function (e, combo, state) {
        if (!state.historyUi.active) {
            state.historyUi.active = true;
            showHistoryPopup();
            getHistory(function (noteHistory, selectedItemIndex) {
                state.historyUi.noteHistory = noteHistory;
                state.historyUi.selectedItemIndex = selectedItemIndex;
                goBackOneItemInHistory(state);
                drawHistoryIntoModal(state);
            });
        } else {
            goBackOneItemInHistory(state);
            drawHistoryIntoModal(state);
        }
    };

    historyUi.shortcutForwards = function (e, combo, state) {
        if (!state.historyUi.active) {
            state.historyUi.active = true;
            showHistoryPopup();
            getHistory(function (noteHistory, selectedItemIndex) {
                state.historyUi.noteHistory = noteHistory;
                state.historyUi.selectedItemIndex = selectedItemIndex;
                goForwardOneItemInHistory(state);
                drawHistoryIntoModal(state);
            });
        } else {
            goForwardOneItemInHistory(state);
            drawHistoryIntoModal(state);
        }
    };

    historyUi.shortcutReleased = function (e, combo, state) {
        state.historyUi.active = false;
        hideHistoryPopup();
        redirectToItem(state.historyUi.noteHistory[state.historyUi.selectedItemIndex]);
    };
})();