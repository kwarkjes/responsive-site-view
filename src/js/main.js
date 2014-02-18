angular.module('rsv.main', ['rsv.byWidthHeightFilter', 'rsv.webView', 'rsv.devicesService', 'rsv.chromeApiService', 'nimbleworks.elementSnapShot']).controller('mainController', function ($scope, $sce, $location, $timeout, byWidthHeightFilter, chromeApiService, devicesService) {
    'use strict';
    function setSelectedURL(url) {
        if (url && url.toString) {
            url = url.toString();
        }
        $scope.newURL = $scope.selectedURL =  $sce.trustAsResourceUrl(url);
        sessionStorage.selectedURL = url;
    }
    function rotateDevice() {
        var width;
        width = $scope.selectedWidth;
        $timeout(function () {
            $scope.$apply(function () {
                $scope.selectedWidth = $scope.selectedHeight;
                $scope.selectedHeight = width;
                $scope.landscape = !$scope.landscape;
            });
        });
    }
    function init() {
        var urlParam;
        urlParam = sessionStorage.selectedURL || $location.search().url;
        setSelectedURL(urlParam);
        $scope.deviceList = [];
        $scope.selectedWidth = 320;
        $scope.selectedHeight = 480;
        devicesService.get().then(function (data) {
            var selectedDeviceIndex;
            $scope.deviceList = byWidthHeightFilter(data);
            selectedDeviceIndex = sessionStorage.selectedDeviceIndex || $location.search().device || 0;
            $scope.selectedDevice = $scope.deviceList[selectedDeviceIndex];
        });
    }
    init();

    $scope.$watch('selectedDevice', function () {
        if ($scope.selectedDevice) {
            sessionStorage.selectedDeviceIndex = $scope.deviceList.indexOf($scope.selectedDevice);
            $scope.selectedWidth = $scope.selectedDevice.width || 0;
            $scope.selectedHeight = $scope.selectedDevice.height || 0;
        }
    });
    $scope.onChangeWidthHeight = function () {
        $scope.selectedDevice = null;
    };
    $scope.onRotateBtn = function () {
        rotateDevice();
    };
    $scope.onCaptureBtn = function () {
        if($scope.selectedDevice.height > window.innerHeight || $scope.selectedDevice.width > window.innerWidth) {
            alert('The device you have selected has a viewport bigger than the browser window and therefore will be clipped.');
        }
        $scope.captureWebView();
    };
    $scope.onSelectURL = function (url) {
        setSelectedURL(url);
    };
    $scope.onAboutBtn = function () {
        chromeApiService.windows.create({
            url: 'templates/about.html',
            type: 'popup'
        });
    };
    $scope.onDeniedBtn = function () {
        chromeApiService.windows.create({
            url: 'templates/denied.html',
            type: 'popup'
        });
    };
    $scope.getRotateTitle = function () {
        if ($scope.selectedDevice) {
            return ($scope.selectedDevice.orientation) ? 'Rotate viewport' : 'This device does not rotate';
        }
        return '';
    };
    chromeApiService.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.getSelectedURL) {
            sendResponse({
                selectedURL: $scope.selectedURL.toString()
            });
        }
    });
});