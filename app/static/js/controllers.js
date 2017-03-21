'use strict';
myApp.controller('DisplayModelsController',['$scope','$http',

    function($scope, $http) {

    $scope.data = {
        choice: null,
        models: available_models.models
    };

    $scope.submit = function() {
        var name = $scope.data.choice.model;
        console.log("Name is " + name);
        $http.get('/api/modelinfo', {
            "params": {
                "model_name": name
            }
        }).then(function(response) {
            $scope.infoCategories = [{
                    "name": "Inputs",
                    "data": response.data.input
                },
                {
                    "name": "Outputs",
                    "data": response.data.output
                },
                {
                    "name": "Parameters",
                    "data": response.data.params
                }
            ];
        });

    };
}]);


myApp.controller('IndexController',['$scope','$http',function($scope, $http) {

}]);

myApp.controller('RunModelController1', ['$scope', '$http', '$parse', function($scope, $http, $parse){
  $scope.parseResult=null;
  // Get inputs and outputs from checkboxes. Get lengths of each for logic checks.
  $scope.inputs = {};
  $scope.inputsLength = Object.keys($scope.inputs).length;
  $scope.outputs = {};
  $scope.outputsLength = Object.keys($scope.outputs).length;
  $scope.updateLength = function(){
    $scope.inputsLength = Object.keys($scope.inputs).length;
    console.log($scope.inputsLength);
    console.log($scope.inputs);
    $scope.outputsLength = Object.keys($scope.outputs).length;
    console.log($scope.outputsLength);
    console.log($scope.outputs);
  };

}]);
