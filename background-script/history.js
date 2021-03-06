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
    if (currentItem) {
        newItem.prev = currentItem;

        // Previous item should know about "next" item
        currentItem.next = newItem;
    }

    this.history.currentItem = newItem;

    if (!this.history.firstItem) {
        this.history.firstItem = newItem;
    }
}

// Set current item as "next" item
// Set previous item as "current" item
// Return "current" item url
History.prototype.goBack = function (data) {
    var currentItem = this.history.currentItem;
    var previousItem = currentItem && currentItem.prev;

    // If current url doesn't match currentItem.url, user have
    // closed current note. Go to current note
    if (currentItem && currentItem.url !== data.currentUrl) {
        return currentItem.url;
    }

    if (previousItem) {
        this.history.currentItem = previousItem;
        return previousItem.url;
    }

    return false;
}

// Set current item's "next" item as current
// Return "current" item url
History.prototype.goForward = function () {
    var currentItem = this.history.currentItem;
    var nextItem = currentItem && currentItem.next;

    if (nextItem) {
        this.history.currentItem = nextItem;
        return nextItem.url;
    }

    return false;
}