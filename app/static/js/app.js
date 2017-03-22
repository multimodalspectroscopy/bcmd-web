var myApp = angular.module('weBCMD', ['ngRoute']);
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
            .when('/csv-upload', {
                templateUrl: '/static/partials/csv-upload.html',
                controller: 'CsvFileController'
            })
            .when('/demand-creation', {
                templateUrl: '/static/partials/demand-creation.html',
                controller: 'DemandCreationController'
            })
            .when('/model-check', {
                templateUrl: '/static/partials/model-check.html',
                controller: 'ModelCheckController'
            })
            .when('/about', {
                templateUrl: '/static/partials/about.html',
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
})(myApp);
