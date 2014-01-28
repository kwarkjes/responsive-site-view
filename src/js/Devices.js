angular.module('rsv.Devices', []).factory('Devices', function ($http, $q) {
    var deviceList, storedList, oneDay;
    deviceList = [];
    oneDay = 60 * 60 * 1000 * 24;
    function requestDeviceList() {
        var request = $http({
            method: 'GET',
            url: 'https://raw.github.com/Nimbleworks/device-browser-viewports/master/devices.json'
        });
        return request.then(function (result) {
            if (result.data) {
                localStorage.deviceList = angular.toJson({
                    date: new Date(),
                    devices: result.data
                });
                return result.data;
            }
            return [];
        }, function () {
            return [];
        });
    }
    storedList = angular.fromJson(localStorage.deviceList);
    if (storedList && storedList.date && storedList.devices && (new Date() - new Date(storedList.date)) < oneDay) {
        deviceList = $q.when(storedList.devices);
    } else {
        deviceList = requestDeviceList();
    }
    return {
        getDeviceList: function () {
            return deviceList;
        }
    };
});