angular.module('rsv.popup', ['rsv.Devices']).controller('popupController', function ($scope, Devices) {
    $scope.selectedDeviceIndex = 0;
    $scope.selectedURL = '';
    Devices.getDeviceList().then(function (response) {
        $scope.deviceList = response.data;
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
            url: 'main.html'
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