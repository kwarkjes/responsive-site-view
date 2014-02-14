angular.module('rsv.byWidthHeightFilter', []).filter('byWidthHeight', function () {
    'use strict';
    return function (input) {
        return input.sort(function (a, b) {
            if (a.width === b.width) {
                return a.height - b.height;
            }
            return a.width - b.width;
        });
    };
});
