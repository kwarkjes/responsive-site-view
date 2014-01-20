angular.module('rsv.main', ['rsv.Devices', 'nimbleworks.elementSnapShot']).controller('mainController', function ($scope, $sce, $timeout) {
    'use strict';
    function setSelectedURL(url) {
        $scope.newURL = $scope.selectedURL = $sce.trustAsResourceUrl(url);
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
}).directive('rsvFrame', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        template: '<iframe id="webView" nim-element-snap-shot="captureWebView" nim-element-snap-shot-newwindow="true" style="width: {{ selectedWidth }}px; height:{{ selectedHeight }}px;" ng-src="{{ selectedURL }}" ></iframe>'
            + '<div id="loader" ng-show="loading">'
                + '<div id="loader-msg"><p><img id="loader-spinner" src="img/reload_2.png" alt="" /></p><p>Loading...</p><p><a  ng-click="onDeniedBtn()">Click here if the page fails to load</a></p></div>'
            + '</div>',
        link: function (scope, element, attrs) {
            element.bind('load', function (evt) {
                scope.$apply(attrs.rsvFrameLoaded);
            });
            function setLoadEvent() {
                scope.loading = true;
                element.find('iframe').bind('load', function (evt) {
                    scope.$apply(scope.loading = false);
                });
            }
            setLoadEvent();
            $rootScope.$on('someEvent', function () {
                toggleScrollBars();
            });
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
}).directive('nimCapture', function ($q, $timeout, $window, $location) {
    'use strict';
    return {
        restrict: 'EA',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            var targetEl = document.getElementById(attrs.nimCapture),
                newWindow = attrs.nimCaptureNewwindow;
            if (!targetEl) {
                return;
            }
            function capture() {
                var deferred = $q.defer();
                chrome.windows.getCurrent(function (currentWin) {
                    chrome.tabs.captureVisibleTab(function (dataSrc) {
                        deferred.resolve(dataSrc);
                    });
                });
                return deferred.promise;
            }
            function clipArea(dataSrc, width, height) {
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    imageObj = new Image(),
                    deferred = $q.defer(),
                    elPosition = getElementPosition(targetEl);
                canvas.width = width;
                canvas.height = height;
                imageObj.onload = function () {
                    context.drawImage(this, -elPosition.x, -elPosition.y);
                    deferred.resolve(canvas.toDataURL());
                };
                imageObj.src = dataSrc;
                return deferred.promise;
            }
            function getElementPosition(el) {
                var obj = el.getBoundingClientRect();
                return {
                    x: obj.left + document.body.scrollLeft,
                    y: obj.top + document.body.scrollTop
                };
            }
            element.on('click', function () {
                $window.location.hash = attrs.nimCapture;
                capture().then(function (dataSrc) {
                    return clipArea(dataSrc, targetEl.offsetWidth, targetEl.offsetHeight);
                }).then(function (clippedSrc) {
                    if (ngModel) {
                        ngModel.$setViewValue(clippedSrc);
                    }
                    if (newWindow) {
                        $window.open(clippedSrc);
                    }
                });
            });
        }
    };
});