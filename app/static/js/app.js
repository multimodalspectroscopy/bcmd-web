var myApp = angular.module('weBCMD', ['ngRoute', 'routeStyles', 'd3']);
(function(app) {
    'use strict';
    // Declare app level module which depends on views, and components


    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
                templateUrl: '/static/partials/home.html',
                controller: 'IndexController',
                css: '/static/css/main-style.css'
            })
            .when('/display-models', {
                templateUrl: '/static/partials/display-models.html',
                controller: 'DisplayModelsController'
            })
            .when('/csv-upload', {
                templateUrl: '/static/partials/csv-upload.html',
                controller: 'CsvFileController',
                css: ['/static/css/run-style.css', '/static/css/plot-style.css']
            })
            .when('/demand-creation', {
                templateUrl: '/static/partials/demand-creation.html',
                controller: 'DemandCreationController',
                css: ['/static/css/demand-style.css', '/static/css/plot-style.css']
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
