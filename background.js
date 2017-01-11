var watchedTabs = {};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // First, validate the message's structure
  if (msg.from === 'keep-content') {
    commands[msg.command](sender.tab.id, msg, sendResponse);
  }
//   if ((msg.command === 'showPageAction')) {
//   }
});

function addToHistory(tabHistory, url) {
    if (tabHistory.latestHistoryItem) {
        var newHistoryItem = {
            url: url,
            prev: tabHistory.latestHistoryItem
        };
        tabHistory.latestHistoryItem.next = newHistoryItem;
        tabHistory.latestHistoryItem = newHistoryItem;
    } else {
        tabHistory.firstHistoryItem = tabHistory.latestHistoryItem = {
            url: url
        };
    }
}

var commands = {
    showPageAction: function (tabId, data) {
        // Enable the page-action for the requesting tab
        watchedTabs[tabId] = {
            temporaryItem: null,
            latestHistoryItem: null,
            firstHistoryItem: null
        };
        chrome.pageAction.show(tabId);
    },
    addToHistoryAndSetCurrentUrl: function (tabId, data) {
        console.log('addToHistoryAndSetCurrentUrl');
        var tabHistory = watchedTabs[tabId];
        addToHistory(tabHistory, data.url);
        if (tabHistory.temporaryItem) {
            tabHistory.temporaryItem = null;
        }
        console.log('Tab history: ', tabHistory);
    },
    setTemporaryUrl: function (tabId, data) { // Url is set as current, but won't be recorded to history
        console.log('setTemporaryUrl');
        var tabHistory = watchedTabs[tabId];

        temporaryItem = {
            url: data.url
        };

        tabHistory.temporaryItem = temporaryItem;
        console.log('Tab history: ', tabHistory);
    },
    goBackInHistory: function (tabId, data, sendResponse) {
        console.log('goBackInHistory');
        var tabHistory = watchedTabs[tabId];
        tabHistory.changingUrl = true;
        if (tabHistory.temporaryItem) {
            tabHistory.temporaryItem = null;
            sendResponse({ url: tabHistory.latestHistoryItem.url });
            console.log('Temp Tab history: ', tabHistory);
            console.log('Back url: ', backUrl);
        } else if (tabHistory.latestHistoryItem) {
            var backUrl = tabHistory.latestHistoryItem.url;
            if (tabHistory.latestHistoryItem.prev) {
                tabHistory.latestHistoryItem = tabHistory.latestHistoryItem.prev;
            }

            console.log('Tab history: ', tabHistory);
            console.log('Back url: ', backUrl);
            sendResponse({ url: backUrl });
        } else {
            tabHistory.changingUrl = false;
            // Do nothing? 
        }
    }
}

//Listen for when a Tab changes state
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (watchedTabs[tab.id] &&
        changeInfo &&
        changeInfo.status == "complete") {

        if (watchedTabs[tab.id].changingUrl) {
            watchedTabs[tab.id].changingUrl = false;
            console.log("Url was just updated");
            return;
        }

        console.log("BG. Tab updated: " + tab.url);

        chrome.tabs.sendMessage(tabId, {
            from: 'keep-bg',
            command: 'url-change',
            url: tab.url
        }, function (response) {
            if (response && response.command) {
                commands[response.command](tab.id, response);
            }
        });
    }
});