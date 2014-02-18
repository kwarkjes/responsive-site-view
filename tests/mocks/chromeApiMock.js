angular.module('rsv.chromeApiService', []).factory('chromeApiService', function () {
    return {
        storage: {
            local: {
                get: function (callback) {
                    var data = angular.fromJson(sessionStorage.getItem('data'));
                    callback(data);
                },
                set: function (data) {
                    sessionStorage.setItem('data', angular.toJson(data));
                },
                clear: function () {
                    sessionStorage.clear();
                }
            }
        }
    };
});