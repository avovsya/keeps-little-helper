var watchedTabs = {};

var commands = {
    showPageAction: function (tabId, data) {
        // Enable the page-action for the requesting tab
        watchedTabs[tabId] = new History();
        chrome.pageAction.show(tabId);
    },
    addUrlToHistory: function (tabId, data) {
        var tabHistory = watchedTabs[tabId];
        tabHistory.addItem(data.data);
    },
    addDummyUrlToHistory: function (tabId, data) {
        var tabHistory = watchedTabs[tabId];
        tabHistory.addDummyItem(data.data);
    },
    goBack: function (tabId, data, sendResponse) {
        var tabHistory = watchedTabs[tabId];
        var prevUrl = tabHistory.goBack();
        sendResponse({ url: prevUrl });
    },
    goToId: function (tabId, data, sendResponse) {
        var tabHistory = watchedTabs[tabId];
        var url = tabHistory.goToId(data.data);
        sendResponse({ url: url });
    },
    goForward: function (tabId, data, sendResponse) {
        var tabHistory = watchedTabs[tabId];
        var nextUrl = tabHistory.goForward();
        sendResponse({ url: nextUrl });
    },
    getHistory: function (tabId, data, sendResponse) {
        sendResponse({ history: watchedTabs[tabId].getHistory() })
    }
}

// Listen for commands from content script
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // First, validate the message's structure
  if (msg.from === 'keep-content') {
    commands[msg.command](sender.tab.id, msg, sendResponse);
  }
});

//Listen for when a Tab changes state
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (watchedTabs[tab.id] &&
        changeInfo &&
        changeInfo.status == "complete") {

        console.log("BG. Tab updated: " + tab.url);

        chrome.tabs.sendMessage(tabId, {
            from: 'keep-bg',
            command: 'urlChanged',
            url: tab.url
        });
    }
});