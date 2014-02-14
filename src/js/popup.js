angular.module('rsv.popup', ['rsv.devicesService', 'rsv.byWidthHeightFilter']).controller('popupController', function ($scope, devicesService) {
    $scope.selectedDeviceIndex = 0;
    $scope.selectedURL = '';
    $scope.deviceList = [];
    devicesService.getDeviceList().then(function (response) {
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
        chrome.tabs.create({
            url: 'templates/main.html'
        }, function (tab) {
            chrome.tabs.onUpdated.addListener(function (tabId) {
                chrome.tabs.sendMessage(tab.id, {
                    deviceList: $scope.deviceList,
                    selectedDeviceIndex: $scope.selectedDeviceIndex,
                    selectedURL: $scope.selectedURL
                });
            });
        });
    };
});