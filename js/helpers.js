"use strict";

var app = app || {};

app.helpers = (function () {
    var nextId = 1;

    function generateId() {
        return nextId++;
    }

    return {
        generateId: generateId,
    }
})();