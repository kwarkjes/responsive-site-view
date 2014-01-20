'use strict';

/* Services */

angular.module('devicePreviewer.services', ['ngResource']).
    factory('Devices', function($resource){
        return $resource('data/devicesizes.json', {callback: function(){}},{
            query: {method:'GET', isArray:true}
        });
    });
