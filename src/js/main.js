angular.module('rsv.main', ['rsv.byWidthHeightFilter', 'rsv.webView', 'rsv.chromeApiService', 'nimbleworks.elementSnapShot']).controller('mainController', function ($scope, $sce, $timeout, chromeApiService) {
    'use strict';
    function setSelectedURL(url) {
        if (url && url.toString()) {
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
    $scope.selectedURL = '';
    $scope.deviceList = [];
    if (sessionStorage.deviceList) {
        $scope.deviceList = angular.fromJson(sessionStorage.deviceList);
    }
    if (sessionStorage.selectedDeviceIndex && $scope.deviceList[sessionStorage.selectedDeviceIndex]) {
        $scope.selectedDevice = $scope.deviceList[sessionStorage.selectedDeviceIndex];
    } else {
        $scope.selectedDevice = $scope.deviceList[0];
    }
    if (sessionStorage.selectedURL) {
        setSelectedURL(sessionStorage.selectedURL);
    }
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
        chrome.windows.create({
            url: 'templates/about.html',
            type: 'popup'
        });
    };
    $scope.onDeniedBtn = function () {
        chrome.windows.create({
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
        var selectedDeviceIndex = 0;
        if (request.selectedURL) {
            $scope.$apply(function () {
                setSelectedURL(request.selectedURL);
            });
        }
        if (request.getSelectedURL) {
            sendResponse({
                selectedURL: $scope.selectedURL.toString()
            });
        }
        if (request.deviceList) {
            if (request.selectedDeviceIndex) {
                if (request.deviceList[request.selectedDeviceIndex]) {
                    selectedDeviceIndex = request.selectedDeviceIndex;
                }
            }
            $scope.$apply(function () {
                $scope.deviceList = request.deviceList;
                $scope.selectedDevice = $scope.deviceList[selectedDeviceIndex];
                sessionStorage.deviceList = angular.toJson($scope.deviceList);
                sessionStorage.selectedDeviceIndex = selectedDeviceIndex;
            });
        }
    });
});