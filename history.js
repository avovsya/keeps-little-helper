var History = function () {
    this.lastId = 0;
    this.history = {
    };
}
History.prototype.getNewId = function () {
    this.lastId += 1;
    return this.lastId;
}

History.prototype.getHistory = function () {
    var items = [];
    var item = this.history.firstItem;
    if (!item) { return items; }

    do {
        items.push({
            id: item.id,
            url: item.url,
            meta: item.meta,
            current: this.history.currentItem == item
        });

        item = item.next;
    } while(item)

    // If current item is a dummy item, mark the last item in history as "current"
    if (this.history.currentItem.dummyItem) {
        items[items.length - 1].current = true;
    }

    return items;
}

History.prototype.goToId = function (data) {
    var item = this.history.firstItem;

    while(item) {
        if (item.id === data.id) {
            this.history.currentItem = item;
            return item.url;
        }
        item = item.next;
    }
    return false;
}

// Add item to history
// Do not add item if it's the same as the current(not dummy) item
// Remove dummy item
// If it's a first item in the history, mark it as first
History.prototype.addItem = function (data) {
    var currentItem = this.history.currentItem;
    var previousItem = currentItem && currentItem.prev;

    var newItem = { 
        id: this.getNewId(),
        url: data.url,
        meta: data.meta
    };

    // No duplicate items in a row
    if (currentItem &&
        currentItem.url === newItem.url) {
        return;
    }

    // Set previous history item for a new item
    if (currentItem && !currentItem.dummyItem) {
        newItem.prev = currentItem;
    } else {
        newItem.prev = previousItem;
    }

    // Previous item should know about "next" item
    if (newItem.prev) {
        newItem.prev.next = newItem;
    }

    this.history.currentItem = newItem;

    if (!this.history.firstItem) {
        this.history.firstItem = newItem;
    }
}

// Add item that won't be a part of a history, but user should be able to 
// "go back" from it
History.prototype.addDummyItem = function (data) {
    var currentItem = this.history.currentItem;
    var previousItem = currentItem && currentItem.prev;

    var newItem = {
        url: data.url,
        dummyItem: true
    };

    if (currentItem && !currentItem.dummyItem) {
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