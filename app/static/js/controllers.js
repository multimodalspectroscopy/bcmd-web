'use strict';
myApp.controller('DisplayModelsController', ['$scope', '$http',

    function($scope, $http) {
        // Define variables
        $scope.defaults = {
            "inputs": {},
            "outputs": {},
            "parameters": {}
        };

        $scope.data = {
            choice: null,
            models: available_models.models
        };
        // define functions
        $scope.submit = function() {
            var name = $scope.data.choice.model;
            console.log("Name is " + name);
            $http.get('/api/modelinfo', {
                "params": {
                    "model_name": name
                }
            }).then(function(response) {
                console.log(response);
                $scope.defaults.inputs = response.data.input;
                $scope.defaults.outputs = response.data.output;
                $scope.defaults.parameters = response.data.params;
                $scope.modelSelected = true;
                console.log($scope.defaults);
            }).catch(function(data) {
                console.log(data);
            });

        };
    }
]);


myApp.controller('IndexController', ['$scope', '$http', function($scope, $http) {

}]);

myApp.controller('ChooseModelController', ['$scope', '$http', 'RunModelData',

    function($scope, $http, RunModelData) {

        $scope.data = {
            choice: null,
            models: available_models.models
        };

        //Define functions

        $scope.chooseModel = function() {
            var name = $scope.data.choice.model;
            console.log("Name is " + name);
            RunModelData.clearData();
            RunModelData.setModel(name);
        };
    }
]);

myApp.controller('CsvFileController', ['$scope', '$http', '$parse', '$window', 'RunModelData',
    function($scope, $http, $parse, $window, RunModelData) {
        // Define initial variables.
        $scope.data = {
            inputHeader: {},
            inputKeys: [],
            inputs: {},
            outputHeader: {},
            outputKeys: [],
            outputs: {}
        };
        $scope.parseResult = null;
        $scope.inputsLength = Object.keys($scope.data.inputHeader).length;
        $scope.outputsLength = Object.keys($scope.data.outputHeader).length;
        $scope.inputSaved = "";
        $scope.outputSaved = "";
        // Define functions.

        $scope.$watchCollection("parseResult", function(newResult, oldResult) {
            $scope.data.inputHeader = {};
            $scope.data.inputs = {};
            $scope.data.outputHeader = {};
            $scope.data.outputs = {};
            console.log("Getting data after file change");
            $scope.getState();
            console.log($scope.data);
        });

        $scope.$watchCollection("data", function(newData, oldData) {
            $scope.inputsLength = Object.keys(newData.inputHeader).length;
            $scope.outputsLength = Object.keys(newData.outputHeader).length;
        });

        $scope.setInputs = function() {
            if (Object.keys($scope.data.inputHeader).length !== 0) {
                $scope.data.inputs = setObject($scope.parseResult, $scope.data.inputHeader);
                $scope.data.inputKeys = Object.keys($scope.data.inputs);
                $scope.inputSaved = "Input Saved!";
            } else {
                $scope.inputSaved = "No inputs selected"
            }
        };

        $scope.setOutputs = function() {
            if (Object.keys($scope.data.outputHeader).length !== 0) {
                $scope.data.outputs = setObject($scope.parseResult, $scope.data.outputHeader);
                $scope.data.outputKeys = Object.keys($scope.data.outputs);
                $scope.outputSaved = "Output Saved!";
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
            RunModelData.setKey($scope.data.inputKeys, "inputKeys");
            RunModelData.setKey($scope.data.outputKeys, "outputKeys");
        };

        // Start of running code.
        // Get inputs and outputs from checkboxes. Get lengths of each for logic checks
        $scope.getState();
        console.log($scope.data);
        // plotCSV($scope.data.inputs);


    }
]);

myApp.controller('TimeCreationController', ['$scope', '$http', '$parse', 'RunModelData', 'PeakTypes',
    function($scope, $http, $parse, RunModelData, PeakTypes) {

        // Define objects
        $scope.time = {
            "startTime": 0,
            "endTime": undefined,
            "sampleRate": 1,
        };
        $scope.timeNeeded = true;
        $scope.timeSignal = [];
        $scope.timeSignalSample = [];
        // Define functions
        $scope.getState = function() {
            $scope.data = RunModelData.getState();
            $scope.timeNeeded = !$scope.data.inputs.hasOwnProperty('t');
            console.log($scope.data);
        };

        $scope.saveState = function() {
            console.log("SAVING STATE");
            console.log($scope.data);
            RunModelData.setKey($scope.data.inputs, "inputs");
            RunModelData.setKey($scope.data.inputHeader, "inputHeader");
        };

        $scope.generateTime = function() {
            $scope.timeSignal = _.range($scope.time.startTime, $scope.time.endTime + $scope.time.sampleRate, $scope.time.sampleRate);
            console.log($scope.timeSignal);
            $scope.timeSignalSample = $scope.timeSignal.slice(0, 10);
        };

        $scope.confirmTime = function() {
            $scope.data.inputs['t'] = $scope.timeSignal;
            $scope.data.inputHeader['t'] = true;
        };

        // Ensure time data is provided

        $scope.$on("$locationChangeStart", function(event) {
          if (!$scope.data.inputs.hasOwnProperty('t') && !confirm('No time data detected. Leave page?'))
            event.preventDefault();
        });
        $scope.getState();

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
        $scope.demandSignal = {
            "time": []
        };
        $scope.repeat = false;

        //} Define functions
        $scope.getState = function() {
            $scope.data = RunModelData.getState();
            if ($scope.data.hasOwnProperty('inputs')) {
                $scope.demandNeeded = !$scope.data.inputs.hasOwnProperty('u');
            }
            console.log("REPEAT? " + $scope.demandNeeded)
            console.log($scope.data);
            $scope.demand.endTime = $scope.data.inputs.t[$scope.data.inputs.t.length - 1];
            $scope.demand.sampleRate = $scope.data.inputs.t[1] - $scope.data.inputs.t[0];
        };
        $scope.saveState = function() {
            console.log("SAVING STATE");
            console.log($scope.data);
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
                    "params": {
                        "demand_dict": $scope.demand
                    }
                }).then(function(response) {
                    console.log(response);
                    $scope.demandSignal.demand = response.data.demand_signal;
                    for (var i = $scope.demand.startTime; i <= $scope.demand.endTime; i += $scope.demand.sampleRate) {
                        $scope.demandSignal.time.push(i);
                    }
                    console.log($scope.demandSignal);
                })
                .catch(function(data) {
                    console.log(data);
                    $scope.response = data;
                });
        };

        $scope.confirmDemand = function() {
            $scope.data.inputs['u'] = $scope.demandSignal.demand;
            $scope.inputHeader.push['u'];
        }

        $scope.getState();

    }
]);

myApp.controller('ParameterController', ['$scope', '$http', '$parse', 'RunModelData',
    function($scope, $http, $parse, RunModelData) {
        // Define initial variables
        $scope.error = "";
        // Define functions
        $scope.getState = function() {
            $scope.data = RunModelData.getState();
            $scope.parameters = $scope.data.parameters;
            console.log($scope.data);
        };

        $scope.getDefaultParameters = function() {
            $http.get('/api/modelinfo', {
                "params": {
                    "model_name": $scope.data.modelName
                }
            }).then(function(response) {
                $scope.defaultParameters = response.data.params;
                console.log($scope.defaultParameters);
            }).catch(function(data) {
                console.log(data);
                $scope.error = data;
            });

        };

        $scope.submitParameters = function() {
            RunModelData.setKey($scope.parameters, "parameters");
        };

        // Running code

        $scope.getState();
        $scope.getDefaultParameters();
    }
]);


myApp.controller('ModelCheckController', ['$scope', '$http', '$parse', 'RunModelData',
    function($scope, $http, $parse, RunModelData) {
        // Define variables
        $scope.defaults = {
            "inputs": {},
            "outputs": {},
            "parameters": {}
        }

        $scope.finalChoice = {};

        // Set loading variable to false until request is sent
        $scope.loading = false;
        // Define functions
        $scope.getState = function() {
            $scope.data = RunModelData.getState();
            $scope.finalChoice.modelName = $scope.data.modelName;
            $scope.finalChoice.params = $scope.data.parameters;
            console.log($scope.data);
        };

        $scope.saveState = function() {
            console.log("SAVING STATE");
            console.log($scope.data);
            RunModelData.setKey($scope.data.inputs, "inputs");
            RunModelData.setKey($scope.data.outputs, "outputs");
            RunModelData.setKey($scope.data.inputHeader, "inputHeader");
            RunModelData.setKey($scope.data.outputHeader, "outputHeader");
        };

        $scope.getDefaults = function() {
            var name = $scope.data.modelName;
            console.log("Name is " + name);
            $http.get('/api/modelinfo', {
                "params": {
                    "model_name": name
                }
            }).then(function(response) {
                $scope.defaults.inputs = response.data.input;
                $scope.defaults.outputs = response.data.output;
                $scope.defaults.parameters = response.data.params;
                console.log("DEFAULTS");
                console.log($scope.defaults);
            }).catch(function(data) {
                console.log("Error in getting defaults: ");
                console.log(data);
            });

        };

        $scope.runModel = function() {
            var runData = $scope.finalChoice;
            $scope.loading = true;
            console.log("Name is " + runData.modelName);

            $http.get('/api/runmodel', {
                "params": runData
            }).then(function(response) {
                console.log(response);
            }).catch(function(data) {
                console.log("Error in running model");
                console.log(data);
            }).finally(function() {
                // called no matter success or failure
                $scope.loading = false;
            });

        };

        // Running code

        $scope.getState();
        $scope.getDefaults();
    }
]);
