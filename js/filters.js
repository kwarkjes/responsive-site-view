'use strict';

/* Filters */

angular.module('devicePreviewer.filters', []).
  filter('byWidthHeight', function(){
    return function(input){
        return input.sort(function(a, b){
            if(a.width == b.width){
                return a.height - b.height;
            }
            return a.width - b.width;
        });
    }
  });
