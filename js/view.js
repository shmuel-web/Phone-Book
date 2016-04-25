"use strict";

var app = app || {};

//todo create an animation modal that will get a callback
// function that will call when the out animation is finished
//& then will complete the rest of animation

app.phoneBook = new app.PhoneBook;

app.view = (function view(phoneBookObj) {

    var phoneBook = phoneBookObj;

    var groupFAB = $('#group-FAB');

    var contactFAB = $('#contact-FAB');

    var title = $('#title');
    var upBtn = $("#up-btn");
    var backBtn = $('#back-btn');
    var childItemsContainer = $('.collection');
    var phoneNumbersContainer = childItemsContainer;
    var itemView = $('.item-view');
    var itemIcon = $('.item-view i.large');
    var itemBtnz = $('.item-btnz');

    //
    //
    //
    function writeItemToDomById(id) {
        var item = phoneBook.getItemById(id);
        itemView.attr('data-id', item.id);
        if (item.name) {
            var group = item;
            //remove the current item from view
            title.empty();
            itemIcon.empty();
            //    add the parent id to the up btn
            upBtn.attr('data-parent', item.parent.id);
            if (item.name != "Root") {
                //    print group name
                title.prepend(item.name);
                title.attr('contenteditable', 'true');
                //    print icon
                itemIcon.html('group');
                itemBtnz.show();
                upBtn.show();
                backBtn.hide()
            }
            else if (item.name == "Root") {
                //    print group name
                title.prepend('Phone-Book');
                title.attr('contenteditable', 'false');
                //    print icon
                itemIcon.html('contact_phone');
                itemBtnz.hide();
                upBtn.hide();
                backBtn.hide();
            }
            //    print child items
            printGroupChildItems(item.childItems);
            showGroupFAB();
        }
        else if (item.fName) {
            var contact = item;
            //    add the parent id to the up btn
            upBtn.attr('data-parent', item.parent.id);
            //    print contact name
            title.empty();
            title.prepend(contact.fName + " " + contact.lName);
            title.attr('contenteditable', 'true');
            //print icon
            itemIcon.empty();
            itemIcon.html('person');
            itemBtnz.fadeIn().attr('data-id', contact.id);
            backBtn.hide();
            upBtn.fadeIn();

            //    print contact phone numbers
            printPhoneNumbers(contact.phoneNum);

            showContactFAb();
        }
        app.dynamicEventListeners();
    }


    function printGroupChildItems(itemsArray) {
        childItemsContainer.empty();
        itemsArray.forEach(function (item) {
            if (item.name) {
                $(
                    '<li class="collection-item avatar"> ' +
                    '<i class="material-icons circle blue">group</i> ' +
                    '<span class="title">' + item.name + '</span> ' +
                    '<p class="grey-text">' + item.childItems.length + ' sub items </p> ' +
                    '<a class="secondary-content"><i data-id="' + item.id + '" class="material-icons display-item">send</i></a>' +
                    '</li>'
                ).prependTo(childItemsContainer).show();
            }
            else if (item.fName) {
                childItemsContainer.prepend(
                    '<li class="collection-item avatar">' +
                    '<i class="material-icons circle green">person</i> ' +
                    '<span class="title">' + item.fName + ' ' + item.lName + '</span> ' +
                    '<p>' + item.phoneNum + '</p> ' +
                    '<a class="secondary-content"><i data-id="' + item.id + '" class="material-icons display-item">send</i></a> ' +
                    '</li>'
                );
            }
        });
    }

    function printPhoneNumbers(phoneNumArray) {
        phoneNumbersContainer.empty();
        phoneNumArray.forEach(function (number, index) {
            phoneNumbersContainer.prepend(
                '<li class="collection-item phone-num" > ' +
                '<a class="waves-effect waves-teal btn-flat"> ' +
                '<i class="material-icons left teal-text">call </i> ' +
                '</a>' +
                '<span contenteditable="true" data-index="' + index + '">' + number + '</span>' +
                '<div class="number-btnz" style="display: none;"> ' +
                    '<a class="num-delete-btn" class="waves-effect waves-red btn-flat"> ' +
                        '<i class="material-icons red-text">delete</i> ' +
                    '</a> ' +
                '</div>'+
                '</li>'
            )
        });
    }

    function addGroupInput() {
        var li = childItemsContainer.children().first();
        var hasInput = li.attr('data-add');
        if (hasInput) {
            li.remove();
        }
        $(
            '<li data-add="true" class="collection-item avatar" style="display: none;"> ' +
            '<i class="material-icons circle blue">group</i> ' +
            '<form id="add-group">' +
            '<div class="input-field">' +
            '<input id="group_name" type="text">' +
            '<label for="group_name" data-error="wrong" data-success="right">add new group</label>' +
            '<div class="input-btnz">' +
            '<button id="submit" class="btn waves-effect waves-light" type="submit" name="action">' +
            'Submit ' +
            '<i class="material-icons right">send</i>   ' +
            '</button>' + '' +
            '<a id="cancel-input" class="waves-effect waves-red btn-flat"> ' +
            'cancel ' +
            '</a> ' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</li>'
        ).prependTo(childItemsContainer).show('slow');
        $('input')[1].focus();
    }

    function addContactInput() {
        var li = childItemsContainer.children().first();
        var hasInput = li.attr('data-add');
        if (hasInput) {
            li.remove();
        }
        $(
            '<li data-add="true" class="collection-item avatar " style="display:none;"> ' +
            '<i class="material-icons circle green">person</i> ' +
            '<form id="add-contact">' +
            '<div class="input-field">' +
            '<input id="first_name" type="text" >' +
            '<label for="first_name" data-error="wrong" data-success="right">first name</label>' +
            '</div>' +
            '<div class="input-field">' +
            '<input id="last_name" type="text"  >' +
            '<label for="last_name" data-error="wrong" data-success="right">last name</label>' +
            '</div>' +
            '<div class="input-field">' +
            '<input id="number" type="text" >' +
            '<label for="number" data-error="wrong" data-success="right">phone number</label>' +
            '</div>' +
            '<div class="input-btnz">' +
            '<button id="submit" class="btn waves-effect waves-light" type="submit" name="action">' +
            'Submit ' +
            '<i class="material-icons right">send</i>   ' +
            '</button>' + '' +
            '<a id="cancel-input" class="waves-effect waves-red btn-flat"> ' +
            'cancel ' +
            '</a> ' +
            '</div>' +
            '</form>' +
            '</li>'
        ).prependTo(childItemsContainer).show('slow');
        $('input')[1].focus();
    }

    function addPhoneNumInputField() {
        var li = childItemsContainer.children().first();
        var hasInput = li.attr('data-add');
        if (hasInput) {
            li.remove();
        }
        $(
            '<li data-add="true" class="collection-item" style="display: none;" > ' +
            '<form id="add-number">' +
            '<div class="input-field">' +
            '<input id="number" type="tel" >' +
            '<label for="number" data-error="wrong" data-success="right">phone number</label>' +
            '<div class="input-btnz">' +
            '<button id="submit" class="btn waves-effect waves-light" type="submit" name="action">' +
            'Submit ' +
            '<i class="material-icons right">send</i>   ' +
            '</button>' + '' +
            '<a id="cancel-input" class="waves-effect waves-red btn-flat"> ' +
            'cancel ' +
            '</a> ' +
            '</div>' +
            '</div>' +
            '</form>' +
            '</li>'
        ).prependTo(childItemsContainer).show('slow');
        $('input')[1].focus();
    }

    function showGroupFAB() {
        groupFAB.show();
        contactFAB.hide();
    }

    function showContactFAb() {
        contactFAB.show();
        groupFAB.hide();
    }

    function hideFAB() {
        groupFAB.hide();
        contactFAB.hide();
    }

    function removeInput() {
        var li = childItemsContainer.children().first();
        var hasInput = li.attr('data-add');
        if (hasInput) {
            li.hide('fast', function () {
                li.remove();
            })
        }
    }

    function showNewChildItem(itemId) {
        //gets the new child item & shows only him
        var item = app.phoneBook.getItemById(itemId);
        if (item.name) {
            var newItem = item.childItems[item.childItems.length - 1];
            if (newItem.name) {
                $(
                    '<li class="collection-item avatar" style="display: none"> ' +
                    '<i class="material-icons circle blue">group</i> ' +
                    '<span class="title">' + newItem.name + '</span> ' +
                    '<p class="grey-text">' + newItem.childItems.length + ' sub items </p> ' +
                    '<a class="secondary-content"><i data-id="' + newItem.id + '" class="material-icons display-item">send</i></a>' +
                    '</li>'
                ).prependTo(childItemsContainer).show('slow');
            }
            else if (newItem.fName) {
                $(
                    '<li class="collection-item avatar" style="display: none">' +
                    '<i class="material-icons circle green">person</i> ' +
                    '<span class="title">' + newItem.fName + ' ' + newItem.lName + '</span> ' +
                    '<p>' + newItem.phoneNum + '</p> ' +
                    '<a class="secondary-content"><i data-id="' + newItem.id + '" class="material-icons display-item">send</i></a> ' +
                    '</li>'
                ).prependTo(childItemsContainer).show('slow');
            }

        }
        else {
            var number = item.phoneNum[item.phoneNum.length - 1];

            $(
                '<li class="collection-item phone-num" style="display: none"> ' +
                '<a class="waves-effect waves-teal btn-flat"> ' +
                '<i class="material-icons left teal-text">call </i> ' +
                '</a>' +
                '<span contenteditable="true" data-index="' + (item.phoneNum.length - 1) + '">' + number + '</span>' +
                '<div class="number-btnz" style="display: none;"> ' +
                    '<a class="num-delete-btn" class="waves-effect waves-red btn-flat"> ' +
                        '<i class="material-icons red-text">delete</i> ' +
                    '</a> ' +
                '</div>'+
                '</li>'
            ).prependTo(childItemsContainer).show(500);
        }

        app.dynamicEventListeners();
    }

    function displaySearchResults(results, searchParam) {
        //remove the current item from view
        title.empty();
        itemIcon.empty();
        //    print results header
        if (results.length > 1) {
            title.prepend(searchParam + '<div>was found ' + results.length + ' times</div>');
        }
        else if (results.length == 1) {
            title.prepend(searchParam + '<div>was found once</div>');
        }
        else if (results.length <= 0) {
            title.prepend(searchParam + '<div>was not found</div>');
        }
        title.attr('contenteditable', 'false');
        //    print icon
        itemIcon.html('youtube_searched_for');
        itemBtnz.fadeOut();
        upBtn.hide();
        backBtn.fadeIn();
        printGroupChildItems(results);
        hideFAB();
        app.dynamicEventListeners();


    }

    function displayItem(id, revers) {
        if (!revers) {
            app.animation.leftOutRightInAnimation(function () {
                writeItemToDomById(id);
            });
        }
        else if (revers) {
            app.animation.RightOutLeftInAnimation(function () {
                writeItemToDomById(id);
            });
        }
    }

    function removePhoneNum(index) {
        //[data-index|="'+ index +'"]
        var phonenumbers = $('li span ');
        phonenumbers.each(function () {
            if ($(this).attr('data-index') == index) {
                var li = $(this).parent();
                li.hide('slow', function () {
                    li.remove();
                })
            }
        })
    }

    function enterEditMode(element){
        var phonNumBtnz = $(element).children().last();
        phonNumBtnz.show('slow');
    }

    return {
        displayItem: displayItem,
        addGroupInputField: addGroupInput,
        addContactInputField: addContactInput,
        addPhoneNumInputField: addPhoneNumInputField,
        removeInput: removeInput,
        showNewChildItem: showNewChildItem,
        displaySearchResults: displaySearchResults,
        writeItemToDomById: writeItemToDomById,
        removePhoneNum: removePhoneNum,
        enterEditMode:enterEditMode,
    }

})(app.phoneBook);
