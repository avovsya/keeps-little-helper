var modalTimeout;

function createHistoryModal() {
    $("body").append(`
    <div class="keeps-helper keeps-modal keeps-history-modal">
      <div class="keeps-helper keeps-modal-content">
        <ul class="keeps-history-list">
        </ul>
      </div>
    </div>`)
}

function drawHistoryIntoModal(history, selectedItemIndex) {
    $('.keeps-history-list').html('');
    _.forEach(history, (item, i) => {
        $('.keeps-history-list').append(`
          <li class="${ i === selectedItemIndex ? 'keeps-selected-history-item' : '' }">
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

$(function () {
    createHistoryModal();
})