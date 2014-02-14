angular.module('rsv.webView', []).directive('rsvWebView', function () {
    'use strict';
    return {
        restrict: 'E',
        template: '<iframe id="webView" nim-element-snap-shot="captureWebView" nim-element-snap-shot-newwindow="true" style="width: {{ selectedWidth }}px; height:{{ selectedHeight }}px;" ng-src="{{ selectedURL }}"></iframe>'
            + '<div id="loader" ng-show="loading">'
            + '<div id="loader-msg"><p><img id="loader-spinner" src="/img/reload_2.png" alt="" /></p><p>Loading...</p></div>'
            + '</div>',
        link: function (scope, element, attrs) {
            scope.reloadURL = function () {
                scope.$apply(scope.loading = true);
                document.getElementById('webView').src = document.getElementById('webView').src;
            };
            function setLoadEvent() {
                scope.loading = true;
                element.find('iframe').bind('load', function (evt) {
                    scope.$apply(scope.loading = false);
                });
                element.find('iframe')[0].onload = function (evt) {
                    scope.$apply(scope.loading = false);
                };
            }
            setLoadEvent();
        }
    };
})