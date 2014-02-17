angular.module('rsv.popup', ['rsv.devicesService', 'rsv.byWidthHeightFilter', 'rsv.chromeApiService']).controller('popupController', function ($scope, devicesService, chromeApiService) {
    $scope.selectedDeviceIndex = 0;
    $scope.selectedURL = '';
    $scope.deviceList = [];
    devicesService.get().then(function (response) {
        $scope.deviceList = response;
    });
    chrome.tabs.getSelected(null, function (tab) {
        if (!tab.url.match(/chrome-extension:\/\//)) {
            $scope.$apply(function () {
                $scope.selectedURL = tab.url;
            });
        } else {
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendMessage(tab.id, {getSelectedURL: true}, function (response) {
                    if (response.selectedURL) {
                        $scope.$apply(function () {
                            $scope.selectedURL = response.selectedURL;
                        });
                    }
                });
            });
        }
    });
    $scope.selectDevice = function () {
        chromeApiService.tabs.create({
            url: 'templates/main.html'
        }, function () {
            chromeApiService.tabs.onUpdated.addListener(function (tabId) {
                chromeApiService.tabs.sendMessage(tabId, {
                    deviceList: $scope.deviceList,
                    selectedDeviceIndex: $scope.selectedDeviceIndex,
                    selectedURL: $scope.selectedURL
                });
            });
        });
    };
});