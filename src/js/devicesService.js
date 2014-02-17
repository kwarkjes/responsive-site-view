angular.module('rsv.devicesService', ['rsv.chromeApiService']).factory('devicesService', function ($http, $q, chromeApiService) {
    var deviceList;
    deviceList = [];

    function isOld(data) {
        var oneDay;
        oneDay = 60 * 60 * 1000 * 24;
        return (!data.date || (new Date() - new Date(data.date)) > oneDay);
    }
    function storeDevices(data) {
        return chromeApiService.storage.sync.set({
            devicelist: {
                date: new Date(),
                devices: data
            }
        });
    }
    function getStoredDevices() {
        var deferred;
        deferred = $q.defer();
        chromeApiService.storage.sync.get(function (data) {
            deferred.resolve(data);
        });
        return deferred.promise;
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

    return {
        get: function () {
            var deferred = $q.defer();
            getStoredDevices().then(function (data) {
                if (isOld(data)) {
                    requestDevices().then(function (response) {
                        storeDevices(response);
                        deferred.resolve(response);
                    });
                } else {
                    deferred.resolve(data);
                }
            });
            return deferred.promise;
        }
    };
});