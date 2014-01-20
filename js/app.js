'use strict';

angular.module('devicePreviewer', ['devicePreviewer.filters', 'devicePreviewer.services']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/popup', {
            templateUrl: 'partials/popup.html'
        });
        $routeProvider.when('/tab', {
            templateUrl: 'partials/tab.html'
        });
        $routeProvider.otherwise({
            redirectTo: '/popup'
        });
    }]);