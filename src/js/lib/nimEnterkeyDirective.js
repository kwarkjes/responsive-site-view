app.module('nimbleworks.enterkey').directive('nimEnterkey', function () {
    'use strict';
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnterkey);
                });
                event.preventDefault();
            }
        });
    };
})