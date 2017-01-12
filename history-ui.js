var template;
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

function getTemplate(cb) {
    if (!template) {
        document.body.innerHTML += '<div id="keeps-helper-history-template"></div>';
        $("#keeps-helper-history-template").load('templates/history-ui.tmpl.html', function () {
            template = $("#keeps-helper-history-template").html();
            return cb(template)
        });
    }

    return cb(template);
}

function renderHistoryTemplate(history) {
    getTemplate((template) => {
        var templateFn = _.template(template);
        $("body").append(templateFn(history))
    });
};

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