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

    function moveInHistory(state, direction) {
        var moveFn = direction === 'forward' ? goForwardOneItemInHistory : goBackOneItemInHistory;
        if (!state.historyUi.active) {
            getHistory(function (noteHistory, selectedItemIndex) {
                if (!noteHistory || noteHistory.length < 2) return;

                state.historyUi.noteHistory = noteHistory;
                state.historyUi.selectedItemIndex = selectedItemIndex;
                showHistoryPopup();
                state.historyUi.active = true;
                moveFn(state);
                drawHistoryIntoModal(state);
            });
        } else {
            moveFn(state);
            drawHistoryIntoModal(state);
        }
    }

    historyUi.initState = function (state) {
        state.historyUi = {
            noteHistory: null,
            selectedItemIndex: null,
            active: false
        };
    };

    historyUi.shortcutBackwards = function (e, combo, state) {
        moveInHistory(state, 'back')
    };

    historyUi.shortcutForwards = function (e, combo, state) {
        moveInHistory(state, 'forward')
    };

    historyUi.shortcutReleased = function (e, combo, state) {
        if (state.historyUi.active) {
            state.historyUi.active = false;
            hideHistoryPopup();
            redirectToItem(state.historyUi.noteHistory[state.historyUi.selectedItemIndex]);
        }
    };
})();