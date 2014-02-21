describe('mainController', function () {
    'use strict';
    var $location, $q, $timeout, scope, createController, devicesService, deviceData;
    beforeEach(module('rsv.mainController', 'rsv.devicesService', 'rsv.tests.deviceData'));
    beforeEach(inject(function ($injector) {
        var $controller, $rootScope;
        sessionStorage.clear();
        devicesService = $injector.get('devicesService');
        deviceData = $injector.get('deviceDataMock');
        $q = $injector.get('$q');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $timeout = $injector.get('$timeout');
        scope = $rootScope.$new();
        createController = function () {
            return $controller('mainController', {
                $scope: scope
            });
        };
        spyOn(devicesService, 'get').andReturn($q.when(deviceData));
    }));
    describe('initialisation', function () {
        it('should set the selected url from a url param on start', function () {
            var testURL;
            testURL = 'http://testing.com';
            $location.search({
                url: testURL
            });
            createController();
            expect(scope.selectedURL.toString()).toEqual(testURL);
        });
        it('should call deviceService and assign result to deviceList', function () {
            createController();
            scope.$digest();
            expect(devicesService.get).toHaveBeenCalled();
            expect(scope.deviceList).toEqual(deviceData);
        });
        it('should set the selected device from sessionStorage if set', function () {
            sessionStorage.selectedDeviceIndex = 1;
            createController();
            scope.$digest();
            expect(scope.selectedDevice).toEqual(deviceData[1]);
        });
        it('should set the selected device from url param where no sessionStorage set', function () {
            $location.search({
                device: 1
            });
            createController();
            scope.$digest();
            expect(scope.selectedDevice).toEqual(deviceData[1]);
        });
    });
    describe('scoped methods', function () {
        beforeEach(function () {
            createController();
        });
        it('should update the selected width and height when a new device is selected', function () {
            scope.selectedDevice = deviceData[0];
            scope.$digest();
            expect(scope.selectedWidth).toEqual(deviceData[0].width);
            expect(scope.selectedHeight).toEqual(deviceData[0].height);
            scope.selectedDevice = deviceData[2];
            scope.$digest();
            expect(scope.selectedWidth).toEqual(deviceData[2].width);
            expect(scope.selectedHeight).toEqual(deviceData[2].height);
        });
        it('should set selected device to null if width/height field change listener is triggered',  function () {
            scope.selectedDevice = deviceData[0];
            scope.$digest();
            expect(scope.selectedDevice).toEqual(deviceData[0]);
            scope.onChangeWidthHeight();
            expect(scope.selectedDevice).toEqual(null);
        });
        it('should swap selected height and width plus invert landscape property if rotate button is triggered', function () {
            scope.selectedDevice = deviceData[0];
            scope.selectedDevice.orientation = true;
            expect(scope.landscape).toBeFalsy();
            scope.onRotateBtn();
            scope.$digest();
            $timeout(function () {
                $scope.$apply(function () {
                    expect(scope.selectedWidth).toEqual(deviceData[0].height);
                    expect(scope.selectedHeight).toEqual(deviceData[0].width);
                    expect(scope.landscape).toBeTruthy();
                });
            });
        });
    });
});