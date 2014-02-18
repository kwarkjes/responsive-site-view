angular.module('rsv.popup', ['rsv.devicesService', 'rsv.byWidthHeightFilter', 'rsv.chromeApiService']).controller('popupController', function ($scope, devicesService, chromeApiService) {
    $scope.selectedDeviceIndex = 0;
    $scope.selectedURL = '';
    $scope.deviceList = [];
    devicesService.get().then(function (response) {
        $scope.deviceList = response;
    });
    chromeApiService.tabs.getSelected(null, function (tab) {
        if (!tab.url.match(/chrome-extension:\/\//)) {
            $scope.$apply(function () {
                $scope.selectedURL = tab.url;
            });
        } else {
            chromeApiService.tabs.sendMessage(tab.id, {getSelectedURL: true}, function (response) {
                if (response.selectedURL) {
                    $scope.$apply(function () {
                        $scope.selectedURL = response.selectedURL;
                    });
                }
            });
        }
    });
    $scope.selectDevice = function () {
        chromeApiService.tabs.create({
            url: 'templates/main.html' + '#?url=' + $scope.selectedURL + '&device=' + $scope.selectedDeviceIndex
        });
    };
});