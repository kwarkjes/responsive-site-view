angular.module('rsv.chromeApiService', []).factory('chromeApiService', function () {
    var mockTab;
    mockTab = {
        id: 1,
        url: 'http://test.com'
    };
    return {
        configMock: {
            tab: function () {
                return mockTab;
            }
        },
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
        },
        tabs: {
            getSelected: function (windowID, callback) {
                callback(mockTab);
            },
            create: function () {}
        }
    };
});