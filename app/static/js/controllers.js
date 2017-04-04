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

myApp.controller('CsvFileController', ['$scope', '$http', '$parse', '$window', 'RunModelData',
    function($scope, $http, $parse, $window, RunModelData) {
        // Define initial variables.
        $scope.data = {
            inputHeader: {},
            inputs: {},
            outputHeader: {},
            outputs: {}
        };
        $scope.parseResult = null;
        $scope.inputsLength = Object.keys($scope.data.inputHeader).length;
        $scope.outputsLength = Object.keys($scope.data.outputHeader).length;
        $scope.inputSaved = "";
        $scope.outputSaved = "";
        // Define functions.

        $scope.$watchCollection("parseResult", function(newResult, oldResult){
          $scope.data.inputHeader = {};
          // $scope.data.inputHeader = Object.keys(newResult);
          $scope.data.inputs = {};
        });

        $scope.$watchCollection("data", function(newData, oldData) {
            $scope.inputsLength = Object.keys(newData.inputHeader).length;
            $scope.outputsLength = Object.keys(newData.outputHeader).length;
        });

        $scope.setInputs = function() {
          if (Object.keys($scope.data.inputHeader).length !== 0){
            $scope.data.inputs = setObject($scope.parseResult, $scope.data.inputHeader);
            $scope.inputSaved = "Input Saved!";
            console.log($scope.data);
          } else {
            $scope.inputSaved = "No inputs selected"
          }
        };

        $scope.setOutputs = function() {
          if (Object.keys($scope.data.outputHeader).length !== 0){
            $scope.data.outputs = setObject($scope.parseResult, $scope.data.outputHeader);
            $scope.outputSaved = "Output Saved!";
            console.log($scope.data);
          } else {
            $scope.outputSaved = "No outputs selected"
          }
        };

        $scope.getState = function() {
            $scope.data = RunModelData.getState();
        };

        $scope.saveState = function() {
            RunModelData.setKey($scope.data.inputs, "inputs");
            RunModelData.setKey($scope.data.outputs, "outputs");
            RunModelData.setKey($scope.data.inputHeader, "inputHeader");
            RunModelData.setKey($scope.data.outputHeader, "outputHeader");
        };

        // Start of running code.
        // Get inputs and outputs from checkboxes. Get lengths of each for logic checks
        $scope.getState();
        // plotCSV($scope.data.inputs);


    }
]);

myApp.controller('DemandCreationController', ['$scope', '$http', '$parse', 'RunModelData', 'PeakTypes',
    function($scope, $http, $parse, RunModelData, PeakTypes) {

        // Define objects
        $scope.demand = {
            "startTime": 0,
            "endTime": "undefined",
            "sampleRate": "undefined",
            "peaks": []
        };
        $scope.peaks = PeakTypes.getPeaks();
        $scope.demandNeeded = true;

        //} Define functions
        $scope.getState = function() {
            $scope.data = RunModelData.getState();
            $scope.demand.endTime = $scope.data.inputs.t[$scope.data.inputs.t.length-1];
            $scope.demand.sampleRate = $scope.data.inputs.t[1]-$scope.data.inputs.t[0];
        };
        $scope.saveState = function() {
            RunModelData.setKey($scope.data.inputs, "inputs");
            RunModelData.setKey($scope.data.outputs, "outputs");
            RunModelData.setKey($scope.data.inputHeader, "inputHeader");
            RunModelData.setKey($scope.data.outputHeader, "outputHeader");
        };


        $scope.addNewChoice = function() {
            var newItemNo = $scope.demand.peaks.length + 1;
            $scope.demand.peaks.push({
                'id': 'peak' + newItemNo
            });
        };

        $scope.removeChoice = function() {
            var lastItem = $scope.demand.peaks.length - 1;
            $scope.demand.peaks.splice(lastItem);
        };

        $scope.getDemandTrace = function() {
            console.log($scope.demand);
            $http.get('/api/demandcreation', {
                "params": $scope.demand
            }).then(function(response) {
                console.log(response);
            });
        };

        $scope.getState();

    }
]);

myApp.controller('ModelCheckController', ['$scope', '$http', '$parse', 'RunModelData',
    function($scope, $http, $parse) {

    }
]);
