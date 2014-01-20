angular.module('rsv.Devices', []).factory('Devices', function ($http, $q) {
    var deviceList;
    if (sessionStorage.deviceList) {
        deviceList = $q.when(angular.fromJson(sessionStorage.deviceList));
    } else {
        deviceList = $http({
            method: 'GET',
            url: '/data/devices.json'
        });
        sessionStorage.deviceList = angular.toJson(deviceList);
    }
    return {
        getDeviceList: function () {
            return deviceList;
        }
    };
});