var myApp = angular.module('weBCMD', ['ngRoute', 'ngCsvImport']);
(function(app) {
    'use strict';
    // Declare app level module which depends on views, and components


    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
                templateUrl: '/static/partials/home.html',
                controller: 'IndexController'
            })
            .when('/display-models', {
                templateUrl: '/static/partials/display-models.html',
                controller: 'DisplayModelsController'
            })
            .when('/run-models', {
                templateUrl: '/static/partials/run-models.html',
                controller: 'RunModelController'
            })
            .when('/about', {
                templateUrl: '/static/partials/about.html',
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
})(myApp);
