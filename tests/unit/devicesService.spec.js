describe('devices service', function () {
    var devicesService, chromeApiMock, $http, $httpBackend, $rootScope, deviceData, devicesURL;
    devicesURL = 'https://raw.github.com/Nimbleworks/device-browser-viewports/master/devices.json';
    beforeEach(module('rsv.devicesService', 'rsv.tests.deviceData'));
    beforeEach(inject(function ($injector, _$http_, _$httpBackend_, _$rootScope_) {
        devicesService = $injector.get('devicesService');
        deviceData = $injector.get('deviceDataMock');
        chromeApiMock = $injector.get('chromeApiService');
        $http = _$http_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $httpBackend.whenGET(devicesURL).respond(200, angular.toJson(deviceData));
        chromeApiMock.storage.local.clear();
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    it('should request the device list from github when storage is clear', function () {
        $httpBackend.expect('GET', devicesURL);
        devicesService.get();
        $rootScope.$digest();
        $httpBackend.flush();
    });
    it('should return an array of device objects', function () {
        var data;
        devicesService.get().then(function (response) {
            data = response;
        });
        $rootScope.$digest();
        $httpBackend.flush();
        expect(angular.equals(data, deviceData)).toBe(true);
    });
    it('should cache the device list in local storage', function () {
        spyOn(chromeApiMock.storage.local, 'set').andCallThrough();
        devicesService.get();
        $rootScope.$digest();
        $httpBackend.flush();
        expect(chromeApiMock.storage.local.set).toHaveBeenCalled();
    });
    it('should retrieve cached device list from local storage if set and in date', function () {
        var newData, storedData;
        newData = {
            date: new Date(),
            devices: ['test']
        };
        chromeApiMock.storage.local.set(newData);
        devicesService.get();
        chromeApiMock.storage.local.get(function (response) {
            storedData = response;
        });
        expect(angular.equals(angular.toJson(storedData), angular.toJson(newData))).toBe(true);
    });
    it('should re-request the data from github if the cache is over a day old', function () {
        var newData, outOfDate;
        outOfDate = new Date();
        outOfDate.setDate(outOfDate.getDate() - 2);
        newData = {
            date: outOfDate,
            devices: deviceData
        };
        chromeApiMock.storage.local.set(newData);
        $httpBackend.expect('GET', devicesURL);
        devicesService.get();
        $rootScope.$digest();
        $httpBackend.flush();
    });
});