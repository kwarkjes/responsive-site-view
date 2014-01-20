angular.module('rsv.main', ['rsv.Devices', 'rsv.filters', 'nimbleworks.elementSnapShot']).controller('mainController', function ($scope, $sce, $timeout) {
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
        console.log('btn');
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
            url: 'about.html',
            type: 'popup'
        });
    };
    $scope.onDeniedBtn = function () {
        chrome.windows.create({
            url: 'denied.html',
            type: 'popup'
        });
    };
    $scope.getRotateTitle = function () {
        return ($scope.selectedDevice.orientation) ? 'Rotate viewport' : 'This device does not rotate';
    };
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
}).directive('rsvFrame', function () {
    'use strict';
    return {
        restrict: 'E',
        template: '<iframe id="webView" nim-element-snap-shot="captureWebView" nim-element-snap-shot-newwindow="true" style="width: {{ selectedWidth }}px; height:{{ selectedHeight }}px;" ng-src="{{ selectedURL }}"></iframe>'
            + '<div id="loader" ng-show="loading">'
                + '<div id="loader-msg"><p><img id="loader-spinner" src="img/reload_2.png" alt="" /></p><p>Loading...</p></div>'
            + '</div>',
        link: function (scope, element, attrs) {
            scope.reloadURL = function () {
                scope.$apply(scope.loading = true);
                document.getElementById('webView').src = document.getElementById('webView').src;
            };
            function setLoadEvent() {
                scope.loading = true;
                element.find('iframe').bind('load', function (evt) {
                    scope.$apply(scope.loading = false);
                });
                element.find('iframe')[0].onload = function (evt) {
                    scope.$apply(scope.loading = false);
                };
            }
            setLoadEvent();
        }
    };
}).directive('ngEnterkey', function () {
    'use strict';
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnterkey);
                });
                event.preventDefault();
            }
        });
    };
})