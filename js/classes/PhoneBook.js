"use strict";

var app = app || {};

app.PhoneBook = (function () {

    function PhoneBook() {
        this.root = new app.Group('Root', false, 0);

        this.currentGroup = this.root;
    }

    PhoneBook.prototype.addContact = function (firstName, lastName, phoneNumbers, callback) {
        var newContact =
            new app.Contact(firstName, lastName, phoneNumbers, this.currentGroup, app.helpers.generateId());
        this.currentGroup.childItems.push(newContact);
        if (callback) {
            callback();
        }
    };

    PhoneBook.prototype.addGroup = function (name) {
        var newGroup = new app.Group(name, this.currentGroup, app.helpers.generateId());
        this.currentGroup.childItems.push(newGroup);
        return newGroup;
    };

    PhoneBook.prototype.deleteItem = function deleteItem(id, callback) {
        if (!isNaN(id)) {
            var item = this.getItemById(id);
            item.parent.childItems.forEach(function (childItem, index, array) {
                if (childItem.id == id) {
                    array.splice(index, 1);
                }
            });
            this.currentGroup = item.parent;
            if (callback) {
                callback();
            }
        }
    };

    PhoneBook.prototype.getItemById = function getItemById(id, phoneBookItem, foundItem) {
        foundItem = foundItem || false;
        var item = phoneBookItem || this.root;

        if (item.id == id) {
            foundItem = item;
        } else if (item.childItems && item.childItems.length > 0 && !foundItem) {
            item.childItems.forEach(function (childItem) {
                foundItem = getItemById(id, childItem, foundItem);
            });
        }
        return foundItem;
    };

    PhoneBook.prototype.changeCurrentGroup = function changeCurrentGroup(id) {
        var group = this.getItemById(id);
        if (group.name) {
            this.currentGroup = group;
        }

    };

    //gets a search parameter returns every item the string is in
    PhoneBook.prototype.search = function search(searchParam, item, foundItems) {
        var foundItems = foundItems || [];
        var sParam = searchParam.toUpperCase();
        var item = item || this.root;

        if (item.fName) {
            var fullName = item.fName.toUpperCase() + " " + item.lName.toUpperCase();
            if (item.fName.toUpperCase().indexOf(sParam) != -1 ||
                item.lName.toUpperCase().indexOf(sParam) != -1 ||
                fullName.indexOf(sParam) != -1) {
                foundItems.push(item);
            }
        }
        else if (item.name) {
            if (item.name.toUpperCase().indexOf(sParam) != -1) {
                foundItems.push(item);
            }
            if (item.childItems.length > 0) {
                item.childItems.forEach(function (childItem) {
                    search(sParam, childItem, foundItems);
                });
            }
        }
        return foundItems;
    };

    //
    //this function takes all the phone book and turns it into an array of JSON objects
    //while saving the tree structure relationships between the objects
    //in every object the 'items' property saves the number of child nodes he has,
    //and they wil be the next items in the array
    //
    PhoneBook.prototype.toJsonArray = function phoneBookToArray(item, PhoneBookItemsArray) {
        var PhoneBookItems = PhoneBookItemsArray || [];

        if (!item) {
            item = this.root;
        }

        if (item) {
            var itemJson;
            if (item.fName) {
                //this means it's a contact
                itemJson = {
                    "firstName": item.fName,
                    "lastName": item.lName,
                    "phoneNumbers": item.phoneNum,
                    "items": 0
                };
                PhoneBookItems.push(itemJson);
            }
            else if (item.name) {
                //this means it's a group
                itemJson = {
                    "name": item.name,
                    "items": item.childItems.length
                };
                PhoneBookItems.push(itemJson);
                item.childItems.forEach(function (childItem) {
                    phoneBookToArray(childItem, PhoneBookItems);
                });
            }
            return PhoneBookItems;
        }

    };

    PhoneBook.prototype.writeToLocal = function writeToLocal() {
        //saves the current phone book items to local storage
        var phoneBookArray = this.toJsonArray();
        localStorage.setItem("phoneBookArray", JSON.stringify(phoneBookArray));
    };

    PhoneBook.prototype.load = function (item, index, array) {
        //this function loads every phone book item from the array in to the object

        if (item) {
            if (item.firstName) {
                this.addContact(item.firstName, item.lastName, item.phoneNumbers);
            }
            else if (item.name && item.name !== "Root") {
                var group = this.addGroup(item.name);

                if (item.items > 0) {
                    this.currentGroup = group;
                    //iterating over his children & inserting them
                    for (var i = ++index; i < index + item.items; i++) {
                        this.load(array[i], i, array);//recurse
                    }
                    array.splice(index, item.items);//removing the added items so that the for each loop cold continue properly
                    this.currentGroup = group.parent;
                }
            }
            else if (item.name == "Root") {
                if (item.items > 0) {

                    for (var i = ++index; i < index + item.items; i++) {
                        this.load(array[i], i, array);
                    }
                    array.splice(index, item.items);
                    this.currentGroup = this.root;
                }
            }
        }
    };

    PhoneBook.prototype.readFromLocal = function readFromLocal() {
        //todo clean bug
        //reads the phone book items from local storage
        var phoneBookArray = JSON.parse(localStorage.getItem("phoneBookArray"));
        var self = this;
        if (phoneBookArray) {
            phoneBookArray.forEach(function (item, index, array) {
                self.load(item, index, array);
            })
        }
        else {
            this.reset();
        }
    };

    PhoneBook.prototype.reset = function resetData() {
        //this function restores the program to a default condition
        localStorage.phoneBookArray =
            '[{"name":"Root","items":6},{"name":"family","items":0},{"name":"friends","items":1},{"name":"best-friends","items":0},{"name":"work","items":0},{"name":"milueim","items":0},{"firstName":"jhon ","lastName":"doe","phoneNumbers":["04-8759918"],"items":0},{"firstName":"jane","lastName":"doe","phoneNumbers":["04-8759918"],"items":0}]';
        this.root.childItems = [];
        this.currentGroup = this.root;
        this.readFromLocal();
    };

    return PhoneBook;

})();
