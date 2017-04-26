var myApp = angular.module('weBCMD', ['ngRoute', 'routeStyles', 'ngMaterial', 'ngMessages']);
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
            .when('/choose-model', {
                templateUrl: '/static/partials/choose-model.html',
                controller: 'ChooseModelController',
                css: ['/static/css/run-style.css']
            })
            .when('/csv-upload', {
                templateUrl: '/static/partials/csv-upload.html',
                controller: 'CsvFileController',
                css: ['/static/css/run-style.css', '/static/css/plot-style.css']
            })
            .when('/time-creation', {
                templateUrl: '/static/partials/time-creation.html',
                controller: 'TimeCreationController',
                css: ['/static/css/demand-style.css']
            })
            .when('/demand-creation', {
                templateUrl: '/static/partials/demand-creation.html',
                controller: 'DemandCreationController',
                css: ['/static/css/demand-style.css', '/static/css/plot-style.css']
            })
            .when('/parameters', {
                templateUrl: '/static/partials/parameters.html',
                controller: 'ParameterController',
                css: ['/static/css/parameter-style.css']
            })
            .when('/model-check', {
                templateUrl: '/static/partials/model-check-2.html',
                controller: 'ModelCheckController',
                css: ['/static/css/check-style.css', '/static/css/plot-style.css']
            })
            .when('/model-display',{
                templateUrl: '/static/partials/model-display.html',
                controller: 'ModelDisplayController',
                css:['/static/css/plot-style.css']
            })
            .when('/about', {
                templateUrl: '/static/partials/about.html',
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
})(myApp);
