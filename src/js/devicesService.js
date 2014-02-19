angular.module('rsv.devicesService', ['rsv.chromeApiService']).factory('devicesService', function ($http, $q, chromeApiService) {
    'use strict';
    function isOld(date) {
        var oneDay;
        oneDay = 60 * 60 * 1000 * 24;
        return (!date || (new Date() - new Date(date)) > oneDay);
    }
    function requestDevices() {
        var request = $http({
            method: 'GET',
            url: 'https://raw.github.com/Nimbleworks/device-browser-viewports/master/devices.json'
        });
        return request.then(function (response) {
            var data;
            if (response.status === 200 && response.data) {
                data = angular.fromJson(response.data);
                if (data instanceof Array) {
                    return data;
                }
            }
            return [];
        }, function () {
            return [];
        });
    }
    function storeDevices(data) {
        return chromeApiService.storage.local.set({
            date: new Date(),
            devices: data
        });
    }
    function getStoredDevices() {
        var deferred;
        deferred = $q.defer();
        chromeApiService.storage.local.get(function (response) {
            if (response && response.date && response.devices) {
                if (isOld(response.date)) {
                    deferred.reject('Data out of date');
                } else {
                    deferred.resolve(response.devices);
                }
            } else {
                deferred.reject('No stored data');
            }
        });
        return deferred.promise;
    }
    return {
        get: function () {
            var deferred = $q.defer();
            getStoredDevices().then(function (response) {
                deferred.resolve(response);
            }, function () {
                requestDevices().then(function (response) {
                    storeDevices(response);
                    deferred.resolve(response);
                });
            });
            return deferred.promise;
        }
    };
});