"use strict";

var app = app || {};

//gets the data from the users local storage if exists else loads the default data
app.phoneBook.readFromLocal();

//display the the root group
app.view.writeItemToDomById(0);
