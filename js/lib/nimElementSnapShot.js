angular.module('nimbleworks.elementSnapShot', []).directive('nimElementSnapShot', function ($q, $timeout, $window) {
    'use strict';
    function getElementPosition(element) {
        var obj = element.getBoundingClientRect();
        return {
            x: obj.left + document.documentElement.scrollLeft,
            y: obj.top + document.documentElement.scrollTop
        };
    }
    function capture() {
        var deferred = $q.defer();
        chrome.windows.getCurrent(function () {
            chrome.tabs.captureVisibleTab(function (dataSrc) {
                deferred.resolve(dataSrc);
            });
        });
        return deferred.promise;
    }
    function clipArea(element, dataSrc, width, height) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            imageObj = new Image(),
            deferred = $q.defer(),
            elPosition = getElementPosition(element[0]);
        canvas.width = width;
        canvas.height = height;
        imageObj.onload = function () {
            context.drawImage(this, -elPosition.x, 0);
            deferred.resolve(canvas.toDataURL());
        };
        imageObj.src = dataSrc;
        return deferred.promise;
    }
    return {
        restrict: 'EA',
        require: '?ngModel',
        scope: {
            nimElementSnapShot: '='
        },
        link: function (scope, element, attrs, ngModel) {
            var newWindow = attrs.nimElementSnapShotNewwindow;
            scope.nimElementSnapShot = function () {
                $window.location.hash = '';
                $window.location.hash = attrs.id;
                capture().then(function (dataSrc) {
                    return clipArea(element, dataSrc, element[0].offsetWidth, element[0].offsetHeight);
                }).then(function (clippedSrc) {
                    if (ngModel) {
                        ngModel.$setViewValue(clippedSrc);
                    }
                    if (newWindow) {
                        $window.open(clippedSrc);
                    }
                });
            };
        }
    };
});