"use strict";

var app = app || {};


app.eventListeners = (function () {

    var upBtn = $('#up-btn');
    var backBtn = $('#back-btn');
    var resetBtn = $('#reset-btn');
    var addGroupBtn = $('#add-group');
    var addContactBtn = $('#add-contact');
    var addPhoneBtn = $('#add-phone-num');
    var deleteBtn = $('#delete-btn');
    var editBtn = $('#edit-btn');
    var itemView = $('.item-view');
    var searchBar = $('#search-bar');
    var title = $('#title');

    searchBar.on('submit', function (e) {//self explanetory
        e.preventDefault();
        var input = $('#search');
        var searchParam = input.val();
        var results = app.phoneBook.search(searchParam);
        app.view.displaySearchResults(results, searchParam);
        e.target.reset();
        input.blur();
    });

    upBtn.click(function (e) {
        var parentId = upBtn.attr('data-parent');//get the parent id from the data attr
        app.view.displayItem(parentId, true);//display the parent item with the revers animation flag
    });

    backBtn.click(function () {
        var itemId = itemView.attr('data-id');//get the last displayed item id
        app.view.displayItem(itemId, true);//display the item with the revers animation flag
    });

    //events for the FAB
    addGroupBtn.click(function () {
        app.view.addGroupInputField();
        var cancelInputBtn = $('#cancel-input');
        cancelInputBtn.click(function () {
            app.view.removeInput();
        });
        //adding the events to the freshly opend form
        var addGroupForm = $('#add-group');
        addGroupForm.on('submit', function (e) {
            e.preventDefault();
            var name = $('#group_name').val();
            var itemId = itemView.attr('data-id');
            var group = app.phoneBook.getItemById(itemId);

            group.addSubGroup(name, function () {
                app.view.removeInput();
                //shows a nice sucess msg to the user
                Materialize.toast('a new phone book group was created', 4000);
                app.view.showNewChildItem(itemId);
                app.phoneBook.writeToLocal();
            });
        });
    });

    addContactBtn.click(function () {
        //show the input field
        app.view.addContactInputField();
        //cancel btn
        var cancelInputBtn = $('#cancel-input');
        cancelInputBtn.click(function () {
            app.view.removeInput();
        });

        var addContactForm = $('#add-contact');
        addContactForm.on('submit', function (e) {
            e.preventDefault();
            var firstName = $('#first_name').val();
            var lastName = $('#last_name').val();
            var phoneNumber = $('#number').val();
            //geting the current group id
            var itemId = itemView.attr('data-id');

            var group = app.phoneBook.getItemById(itemId);

            group.addContact(firstName, lastName, [phoneNumber], function () {
                app.view.removeInput();
                //shows a nice success msg to the user
                Materialize.toast('a new phone book contact was created', 4000);
                app.view.showNewChildItem(itemId);
                app.phoneBook.writeToLocal();
            });
        });
    });

    addPhoneBtn.click(function () {
        app.view.addPhoneNumInputField();
        var cancelInputBtn = $('#cancel-input');
        cancelInputBtn.click(function () {
            app.view.removeInput();
        });

        var addNumberForm = $('#add-number');
        addNumberForm.on('submit', function (e) {
            e.preventDefault();
            var phoneNum = $('#number').val();

            //geting the current group id
            var itemId = itemView.attr('data-id');

            //geting the current object by the the id from the DOM
            var contact = app.phoneBook.getItemById(itemId);

            contact.addPhoneNumber(phoneNum, function () {
                app.view.removeInput();
                Materialize.toast('a new phone number was added', 4000)
                app.view.showNewChildItem(itemId);
                app.phoneBook.writeToLocal();
            });
        });
    });

    resetBtn.click(function () {

        $('#reset-modal').openModal();
        //adding the event to the users confirmation
        $('#reset-confirm').click(function () {
            app.phoneBook.reset();
            app.view.displayItem(0);
        });
    });

    deleteBtn.click(function () {
        //show confermation modal
        $('#delete-modal').openModal();
        $('#delete-confirm').click(function () {
            var itemId = itemView.attr('data-id');
            //    delete from the phone book
            app.phoneBook.deleteItem(itemId, function () {
                //    dispaly items parent group by triggering a click event on the up btn
                upBtn.click();
                $('#delete-modal').closeModal();
                Materialize.toast('phone book item was deleted', 4000);
                app.phoneBook.writeToLocal();
            });
        });
    });

    editBtn.on('click', function () {
        title.focus();
        $('.number-btnz').show('slow');
    });

    //
    //when blur item name on edit mode fires event which saves the new names
    //to the object and to the local storage
    //
    title.on('blur', function (e) {

        var newText = e.target.innerHTML;
        var itemId = itemView.attr('data-id');
        var item = app.phoneBook.getItemById(itemId);
        item.changeName(newText);
        app.phoneBook.writeToLocal();

    }).on('keypress', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            e.target.blur();
        }
    })
})();