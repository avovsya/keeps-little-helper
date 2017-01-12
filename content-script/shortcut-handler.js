var initState = function (state) {
    historyUi.initState(state);
}

var shortcuts = [
    {
        shortcut: 'ctrl+[',
        action: historyUi.shortcutBackwards
    },
    {
        shortcut: 'ctrl+]',
        action: historyUi.shortcutForwards
    },
    {
        shortcut: ['ctrl'],
        action: historyUi.shortcutReleased,
        event: 'keyup'
    },
];

(function () {
    var state = {}
    initState(state);
    _.each(shortcuts, (shortcut) => {
        var action = shortcut.action;
        Mousetrap.bind(shortcut.shortcut, (e, combo) => {
            action(e, combo, state);
        }, shortcut.event);
    });
})()
