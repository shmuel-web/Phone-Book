"use strict";

var app = app || {};

//
//events for dynamicly created DOM elements
//
app.dynamicEventListeners = (function () {

    var displayItemBtn = $('.secondary-content');
    var itemView = $('.item-view');


    displayItemBtn.on('click', function (e) {
        //gets the item id from the DOM
        var itemId = e.target.getAttribute('data-id');
        app.view.displayItem(itemId);
    });

    var phoneNumber = $('li span');//geting the phone number edit mode element
    phoneNumber.on('blur', function (e) {
        //when exiting the edit mode
        var newNumber = e.target.innerHTML;

        var itemId = itemView.attr('data-id');//gets the the curently displayed item from the DOM

        var index = $(e.target).attr('data-index');//gets the index of the phone number from the DOM
        var contact = app.phoneBook.getItemById(itemId);
        contact.changePhoneNum(newNumber, index);
        app.phoneBook.writeToLocal();
        if (newNumber == "") {
            //if the user deletes the hole number remove the item from the DOM
            app.view.removePhoneNum(index);
        }
    }).on('keypress', function (e) {
        if (e.which == 13) {
            //when the user press ENTER in edit mode
            e.preventDefault();
            //exits the edit mode & activate the blur event from above which will do all the rest...
            e.target.blur();
        }
    });


    $('.phone-num').one('click', function (e) {
        app.view.enterEditMode(e.target);
    })

    var deletNumeBtn = $('.num-delete-btn');
    var itemView = $('.item-view');
    var itemId = itemView.attr('data-id');//gets the the curently displayed item from the DOM
    deletNumeBtn.on('click',function(e){
        console.log('yesh');
        var index = $(e.target).parent().parent().prev().attr('data-index');
        console.log(index);
        var contact = app.phoneBook.getItemById(itemId);
        contact.deletePhoneNum(index);
        app.view.removePhoneNum(index);
        app.phoneBook.writeToLocal();

    });
});
