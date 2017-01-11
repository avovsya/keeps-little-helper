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

function showHistoryPopup() {
  document.body.innerHTML += '<dialog id="keeps-helper-history">This is a dialog.<br><button>Close</button></dialog>';
  var dialog = document.querySelector("#keeps-helper-history");
  dialog.showModal();
}
function closeHistoryPopup() {
  var dialog = document.querySelector("#keeps-helper-history");
  dialog.close();
  dialog.remove();
}
