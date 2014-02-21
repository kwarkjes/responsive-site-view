describe('popupController', function () {
    'use strict';
    var scope, $q, devicesService, chromeApiMock, deviceData, createController;
    beforeEach(module('rsv.popupController', 'rsv.devicesService', 'rsv.tests.deviceData', 'rsv.chromeApiService'));
    beforeEach(inject(function ($injector) {
        var $rootScope, $controller;
        deviceData = $injector.get('deviceDataMock');
        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();
        $controller = $injector.get('$controller');
        createController = function () {
            $controller('popupController', {
                $scope: scope
            });
        };
        $q = $injector.get('$q');
        devicesService = $injector.get('devicesService');
        chromeApiMock = $injector.get('chromeApiService');
        spyOn(devicesService, 'get').andReturn($q.when(deviceData));
    }));
    it('should get the url from the selected chrome tab', function () {
        var testURL;
        testURL = 'http://testurl.com';
        chromeApiMock.configMock.tab().url = testURL;
        createController();
        scope.$digest();
        expect(scope.selectedURL).toEqual(testURL);
    });
    it('should call deviceService and assign result to deviceList', function () {
        createController();
        scope.$digest();
        expect(devicesService.get).toHaveBeenCalled();
        expect(scope.deviceList).toEqual(deviceData);
    });
    it('should open a new tab on device select with search params for url and device index', function () {
        spyOn(chromeApiMock.tabs, 'create');
        createController();
        scope.selectDevice();
        scope.$digest();
        expect(chromeApiMock.tabs.create).toHaveBeenCalledWith({
            url: 'templates/main.html' + '#?url=' + scope.selectedURL + '&device=' + scope.selectedDeviceIndex
        });
    });
});