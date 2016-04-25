"use strict";

var app = app || {};

app.animation = (function () {
    var main = $('main');

    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

    function leftOutRightInAnimation(callback) {
        var outAnimationName = "animated fadeOutLeftBig";
        var inAnimationName = "animated fadeInRightBig";

        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        //removing the currently displayed item from the DOM nicely with an animation
        main.addClass(outAnimationName).one(animationEnd, function () {
            //activate the callback function that writs the new item data to the DOM
            callback();
            //removing the class of the previous animation
            main.removeClass(outAnimationName);
            //adding the class that trrigers the animation that inserts the new desplayed item to the DOM nicely
            main.addClass(inAnimationName).one(animationEnd, function () {
                //clearing the animation class
                main.removeClass(inAnimationName);
            })
        });
    }

    function RightOutLeftInAnimation(callback) {
        var outAnimationName = "animated fadeOutRightBig";
        var inAnimationName = "animated fadeInLeftBig";

        //removing the currently displayed item from the DOM nicely with an animation
        main.addClass(outAnimationName).one(animationEnd, function () {
            //activate the callback function that writs the new item data to the DOM
            callback();
            //removing the class of the previous animation
            main.removeClass(outAnimationName);
            //adding the class that trrigers the animation that inserts the new desplayed item to the DOM nicely
            main.addClass(inAnimationName).one(animationEnd, function () {
                //clearing the animation class
                main.removeClass(inAnimationName);
            })
        });
    }

    return {
        leftOutRightInAnimation: leftOutRightInAnimation,
        RightOutLeftInAnimation: RightOutLeftInAnimation,
    }
})();

