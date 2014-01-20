'use strict';

/* Controllers */

function PopupCtrl($scope, Devices){
    $scope.devices = Devices.query(function(){
        $scope.device = $scope.devices[0];
    });
    $scope.onSubmit = function(){
        chrome.tabs.create({url: 'main.html#/tab?url=' + encodeURIComponent(this.popupForm.url.$viewValue) + '&device=' + encodeURIComponent(this.popupForm.device.$viewValue.name)});
    };
    chrome.tabs.query({'active': true},function(tabs){
        if(tabs[0].url.match(/chrome-extension:\/\//)){
            var result = tabs[0].url.match(/\?url=([^&#]*)/);
            $scope.url = decodeURIComponent(result[1]) || '';
            $scope.$apply();
        }else{
            $scope.url = tabs[0].url;
        }
    });
}
function TabCtrl($scope, $routeParams, $filter, $timeout, Devices){
    var holderEl = document.getElementById('holder');
    var viewEl = document.getElementById('webview');
    viewEl.onload = function(){
        holderEl.className = '';
    }
    if($routeParams['url']){
        $scope.url = $routeParams['url'];
        $scope.selectedURL = $scope.url;
    }
    $scope.devices = Devices.query(function(){
        $scope.selectedDevice = {};
        if($routeParams['device']){
            $scope.device = $filter('filter')($scope.devices, {name:decodeURIComponent($routeParams['device'])})[0];
            $scope.selectedDevice.orientation = $scope.device.orientation;
            $scope.selectedDevice.width = $scope.device.width;
            $scope.selectedDevice.height = $scope.device.height;
        }
    });
    $scope.onURLSubmit = function(){
        var url = this.urlForm.url.$viewValue;
        if($scope.selectedURL == url){
            $scope.selectedURL = '';
            $timeout(function(){
                holderEl.className = 'loading';
                $scope.selectedURL = url;
            },50);
        }else{
            holderEl.className = 'loading';
            $scope.selectedURL = url;
        }
    };
    $scope.onDeviceChange = function(){
        $scope.selectedDevice.orientation = this.device.orientation;
        $scope.selectedDevice.width = this.device.width;
        $scope.selectedDevice.height = this.device.height;
    };
    $scope.scrollbars = 'yes';
    $scope.landscape = false;
    $scope.rotateDevice = function() {
        var width = $scope.selectedDevice.width;
        $scope.selectedDevice.width = $scope.selectedDevice.height;
        $scope.selectedDevice.height = width;
    }
    $scope.onCaptureBtn = function(){
        if($scope.selectedDevice.height > window.innerHeight || $scope.selectedDevice.width > window.innerWidth){
            alert('This feature is still experimental. The device you have selected has a viewport bigger than the browser window and therefore will be clipped (sorry).');
        }
        capture(function(imageData){
            var img = draw(imageData, $scope.selectedDevice.width, $scope.selectedDevice.height, holderEl.offsetLeft - document.body.scrollLeft + 16, holderEl.offsetTop - document.body.scrollTop + 16, window.open);
        })
    };
    $scope.onAboutBtn = function(){
        chrome.windows.create({
            url: 'about.html',
            type: 'popup'
        });
    };
    $scope.onDeniedBtn = function(){
        chrome.windows.create({
            url: 'denied.html',
            type: 'popup'
        });
    };
    function capture(callback){
        chrome.windows.getCurrent(function(currentWin){
            chrome.tabs.captureVisibleTab(function(dataSrc){
                 callback(dataSrc);
            });
        });
    }
    function draw(dataSrc, width, height, offsetX, offsetY, callback){
        var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        imageObj = new Image();
        canvas.width = width;
        canvas.height = height;
        imageObj.onload = function(){
            context.drawImage(this, -offsetX, -offsetY);
            callback(canvas.toDataURL());
        };
        imageObj.src = dataSrc;
    }
}