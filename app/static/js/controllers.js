'use strict';
myApp.controller('DisplayModelsController', ['$scope', '$http',

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
    }
]);


myApp.controller('IndexController', ['$scope', '$http', function($scope, $http) {

}]);

myApp.controller('CsvFileController', ['$scope', '$http', '$parse', 'RunModelData',
    function($scope, $http, $parse, RunModelData) {
        // Define initial variables.
        $scope.data = {
          inputHeader: {},
          inputs: {},
          outputHeader: {},
          outputs: {}
        };
        console.log($scope.data);
        $scope.parseResult = null;
        // $scope.inputHeader = {};
        $scope.inputsLength = Object.keys($scope.data.inputHeader).length;
        //$scope.outputHeader = {};
        $scope.outputsLength = Object.keys($scope.data.outputHeader).length;
        $scope.inputSaved=false;
        $scope.outputSaved=false;
        // Define functions.

        $scope.setInputs = function(){
          $scope.data.inputs = setObject($scope.parseResult, $scope.data.inputHeader);
          $scope.inputSaved = true;
          console.log($scope.data);
        };

        $scope.setOutputs = function(){
          $scope.data.outputs = setObject($scope.parseResult, $scope.data.outputHeader);
          $scope.outputSaved = true;
          console.log($scope.data);
        };

        $scope.getState = function(){
          $scope.data = RunModelData.getState();
        };

        $scope.saveState = function(){
          RunModelData.setKey($scope.data.inputs, "inputs");
          RunModelData.setKey($scope.data.outputs, "outputs");
          RunModelData.setKey($scope.data.inputHeader, "inputHeader");
          RunModelData.setKey($scope.data.outputHeader, "outputHeader");
        };

        // Start of running code.
        // Get inputs and outputs from checkboxes. Get lengths of each for logic checks
        $scope.getState();
        $scope.updateLength = function() {
            $scope.inputsLength = Object.keys($scope.data.inputHeader).length;
            console.log($scope.inputsLength);
            console.log($scope.data.inputHeader);
            $scope.outputsLength = Object.keys($scope.data.outputHeader).length;
            console.log($scope.outputsLength);
            console.log($scope.data.outputHeader);
        };


    }
]);

myApp.controller('DemandCreationController', ['$scope', '$http', '$parse', 'RunModelData',
    function($scope, $http, $parse, RunModelData) {
      // Define functions
      $scope.getState = function(){
        $scope.data = RunModelData.getState();
      };
      $scope.saveState = function(){
        RunModelData.setKey($scope.data.inputs, "inputs");
        RunModelData.setKey($scope.data.outputs, "outputs");
        RunModelData.setKey($scope.data.inputHeader, "inputHeader");
        RunModelData.setKey($scope.data.outputHeader, "outputHeader");
      };
      $scope.getState();

    }
]);

myApp.controller('ModelCheckController', ['$scope', '$http', '$parse', 'RunModelData',
    function($scope, $http, $parse) {

    }
]);
