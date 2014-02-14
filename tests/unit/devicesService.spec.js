describe('devices service', function () {
    var Devices, $http, $httpBackend, $rootScope, deviceData, devicesURL;
    devicesURL = 'https://raw.github.com/Nimbleworks/device-browser-viewports/master/devices.json';
    deviceData = [
        {
            "name": "Nokia C3-01",
            "width": 240,
            "height": 320,
            "orientation": false
        },
        {
            "name": "Nexus 7",
            "width": 800,
            "height": 1280,
            "orientation": true
        },
        {
            "name": "iPhone 5",
            "width": 320,
            "height": 568,
            "orientation": true
        }
    ];
    beforeEach(module('rsv.devicesService'));
    beforeEach(inject(function ($injector, _$http_, _$httpBackend_, _$rootScope_) {
        Devices = $injector.get('devicesService');
        $http = _$http_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $httpBackend.whenGET(devicesURL).respond(200, angular.toJson(deviceData));
    }));
    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    it('should request the device list from github when localstorage is clear', function () {
        localStorage.clear();
        $httpBackend.expect('GET', devicesURL);
        Devices.getDeviceList();
        $rootScope.$digest();
        $httpBackend.flush();
    });
    it('should return an array of device objects', function () {
        var data;
        Devices.getDeviceList().then(function (response) {
            data = response;
        });
        $rootScope.$digest();
        expect(angular.equals(data, deviceData)).toBe(true);
    });
    it('should cache the device list in local storage', function () {
        localStorage.clear();
        Devices.getDeviceList();
        $rootScope.$digest();
        $httpBackend.flush();
        expect(angular.equals(angular.fromJson(localStorage.deviceList).devices, deviceData)).toBe(true);
    });
    it('should retrieve cached device list from local storage if set and in date', function () {
        var newData = angular.toJson({
            date: new Date(),
            devices: ['test']
        });
        localStorage.deviceList = angular.toJson(newData);
        Devices.getDeviceList();
        expect(angular.equals(angular.fromJson(localStorage.deviceList), newData)).toBe(true);
    });
    it('should re-request the data from github if the cache is over a day old', function () {
        var newData, outOfDate;
        outOfDate = new Date();
        outOfDate.setDate(outOfDate.getDate() - 1);
        newData = angular.toJson({
            date: outOfDate,
            devices: deviceData
        });
        localStorage.deviceList = angular.toJson(newData);
        $httpBackend.expect('GET', devicesURL);
        Devices.getDeviceList();
        $rootScope.$digest();
        $httpBackend.flush();
    });
});