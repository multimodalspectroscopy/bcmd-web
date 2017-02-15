(function() {
    'use strict';
    console.log(available_models);
    // Declare app level module which depends on views, and components
    var app = angular.module('weBCMD', ['ngRoute']);

    app.controller('DisplayModelsController',['$scope',function($scope){
      $scope.data={
        choice:null,
        models:available_models.models
      };
    }]);
})();
