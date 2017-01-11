var History = function () {
    this.history = {
    };
}

// Add item to history
// Do not add item if it's the same as the current(not dummy) item
// Remove dummy item
// If it's a first item in the history, mark it as first
History.prototype.addItem = function (url) {
    var currentItem = this.history.currentItem;
    var previousItem = currentItem && currentItem.prev;

    var newItem = { 
        url: url
    };

    // No duplicate items in a row
    if (currentItem &&
        currentItem.url === newItem.url) {
        return;
    }

    // Set previous history item for a new item
    if (!currentItem.dummyItem) {
        newItem.prev = currentItem;
    } else {
        newItem.prev = previousItem;
    }

    // Previous item should know about "next" item
    newItem.prev.next = newItem;

    this.history.currentItem = newItem;

    if (!this.history.firstItem) {
        this.history.firstItem = newItem;
    }
}

// Add item that won't be a part of a history, but user should be able to 
// "go back" from it
History.protorype.addDummyItem = function (url) {
    var currentItem = this.history.currentItem;
    var previousItem = currentItem && currentItem.prev;

    var newItem = {
        url: url,
        dummyItem: true
    };

    if (!currentItem.dummyItem) {
        newItem.prev = currentItem;
    } else {
        newItem.prev = previousItem;
    }

    this.history.currentItem = newItem;
}

// Set current item as "next" item, if it's not a dummy item
// Set previous item as "current" item
// Return "current" item url
History.prototype.goBack = function () {
    var currentItem = this.history.currentItem;
    var previousItem = currentItem && currentItem.prev;

    if (previousItem) {
        this.history.currentItem = previousItem;
        return previousItem.url;
    } else {
        return false;
    }
}

// Set current item's "next" item as current
// Return "current" item url
History.prototype.goForward = function () {
    var currentItem = this.history.currentItem;
    var nextItem = currentItem && currentItem.next;

    if (nextItem) {
        this.history.currentItem = nextItem;
        return nextItem.url;
    } else {
        return false;
    }
}