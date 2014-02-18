angular.module('rsv.tests.deviceData', []).factory('deviceDataMock', function () {
    return [
        {
            "name": "Nokia C3-01",
            "width": 240,
            "height": 320,
            "orientation": false
        },
        {
            "name": "Nexus 7",
            "width": 800,
            "height": 1280,
            "orientation": true
        },
        {
            "name": "iPhone 5",
            "width": 320,
            "height": 568,
            "orientation": true
        }
    ];
});