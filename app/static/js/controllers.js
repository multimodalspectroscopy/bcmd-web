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
            models: null
        };
        // define functions
        $scope.submit = function() {
            var name = $scope.data.choice.model;
            $http.get('/api/modelinfo', {
                "params": {
                    "model_name": name
                }
            }).then(function(response) {
                $scope.defaults.inputs = response.data.input;
                $scope.defaults.outputs = response.data.output;
                $scope.defaults.parameters = response.data.params;
                $scope.modelSelected = true;
            }).catch(function(data) {
                console.log(data);
            });

        };

        $scope.getModels = function() {
            $http({
                method: 'GET',
                url: '/api/getmodels'
            }).then(function(response) {
                $scope.data.models = response.data.models;
            }).catch(function(data) {
                console.log("Error getting modeldefs: ");
                console.log(data);
            });
        };

        $scope.getModels();
    }
]);

adminApp.controller('ModelUploadController', ['$scope', '$http',
    function($scope, $http) {

        // Define variables
        $scope.defaults = {
            "inputs": {},
            "outputs": {},
            "parameters": {}
        };

        $scope.data = {
            choice: null,
            models: null
        };

        $scope.getModels = function() {
            $http({
                method: 'GET',
                url: '/api/getmodels'
            }).then(function(response) {
                console.log(response)
                $scope.data.models = response.data.models;
            }).catch(function(data) {
                console.log("Error getting modeldefs: ");
                console.log(data);
            });
        };
        // define functions
        $scope.submit = function() {
            var name = $scope.data.choice.model;
            $http({
                method: 'POST',
                url: '/api/modelinfo',
                "params": {
                    "model_name": name
                }
            }).then(function(response) {
                if (response.status == 250) {
                    $scope.modelExists = true;
                }
                $http.get('/api/modelinfo', {
                    "params": {
                        "model_name": name
                    }
                }).then(function(response) {
                    $scope.defaults.inputs = response.data.input;
                    $scope.defaults.outputs = response.data.output;
                    $scope.defaults.parameters = response.data.params;
                    $scope.modelUploaded = true;
                }).catch(function(data) {
                    console.log("Error getting model information: ");
                    console.log(data);
                })
            }).catch(function(data) {
                console.log("Error uploading model information: ");
                console.log(data);
            });

        };

        $scope.getModels();

    }
]);

adminApp.controller('CompileModelController', ['$scope', '$http', function($scope, $http) {

    // Define variables
    $scope.result = "";
    $scope.data = {
        choice: null,
        models: null
    };
    $scope.getDefs = function() {
        $http({
            method: 'GET',
            url: '/api/getmodeldefs'
        }).then(function(response) {
            console.log(response)
            $scope.data.models = response.data.models;
        }).catch(function(data) {
            console.log("Error getting modeldefs: ");
            console.log(data);
        });
    };
    // define functions
    $scope.submit = function() {
        var name = $scope.data.choice.model;
        $http({
            method: 'GET',
            url: '/api/compilemodel',
            "params": {
                "model_name": name
            }
        }).then(function(response) {
            var stdout = response.data.stdout;
            $scope.modelCompiled = true;
            $scope.result = stdout.substr(2, stdout.length - 5);
        }).catch(function(data) {
            console.log("Error compiling model: ");
            console.log(data);
        });
    };

    $scope.getDefs();
}]);

adminApp.controller('AdminHomeController', ['$scope', '$http', function($scope, $http) {

}]);

myApp.controller('IndexController', ['$scope', '$http', function($scope, $http) {

}]);

myApp.controller('ChooseModelController', ['$scope', '$http', 'RunModelData',

    function($scope, $http, RunModelData) {

        $scope.data = {
            choice: null,
            models: null
        };

        $scope.getModels = function() {
            $http({
                method: 'GET',
                url: '/api/getmodels'
            }).then(function(response) {
                $scope.data.models = response.data.models;
            }).catch(function(data) {
                console.log("Error getting modeldefs: ");
                console.log(data);
            });
        };

        //Define functions

        $scope.chooseModel = function() {
            var name = $scope.data.choice.model;
            RunModelData.clearData();
            RunModelData.setModel(name);
        };

        $scope.getModels();
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
            $scope.getState();
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
        };

        $scope.saveState = function() {
            RunModelData.setKey($scope.data.inputs, "inputs");
            RunModelData.setKey($scope.data.inputHeader, "inputHeader");
        };

        $scope.generateTime = function() {
            $scope.timeSignal = _.range($scope.time.startTime, Number($scope.time.endTime) + $scope.time.sampleRate, $scope.time.sampleRate);
            $scope.timeSignalSample = $scope.timeSignal.slice(0, 10);
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
            $scope.demand.endTime = $scope.data.inputs.t[$scope.data.inputs.t.length - 1];
            $scope.demand.sampleRate = $scope.data.inputs.t[1] - $scope.data.inputs.t[0];
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
            console.log($scope.demand);
        };

        $scope.removeChoice = function() {
            var lastItem = $scope.demand.peaks.length - 1;
            $scope.demand.peaks.splice(lastItem);
            console.log($scope.demand);
        };

        $scope.getDemandTrace = function() {
            console.log($scope.demand);
            $scope.demandSignal = {
                "time": []
            };
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
                    console.log("Error getting trace");
                    console.log(data);
                    $scope.response = data;
                });
        };

        $scope.confirmDemand = function() {
            $scope.data.inputs['u'] = $scope.demandSignal.demand;
            $scope.data.inputHeader.push('u');
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
        };

        $scope.getDefaultParameters = function() {
            $http.get('/api/modelinfo', {
                "params": {
                    "model_name": $scope.data.modelName
                }
            }).then(function(response) {
                $scope.defaultParameters = response.data.params;
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
        $scope.lengths = {};

        // Set finished variable to false until response is returned
        $scope.finished = false;
        // Define functions
        $scope.getState = function() {
            $scope.data = RunModelData.getState();
            $scope.finalChoice.modelName = $scope.data.modelName;
            $scope.finalChoice.params = $scope.data.parameters;

        };



        $scope.saveState = function() {
            RunModelData.setKey($scope.data.inputs, "inputs");
            RunModelData.setKey($scope.data.outputs, "outputs");
            RunModelData.setKey($scope.data.inputHeader, "inputHeader");
            RunModelData.setKey($scope.data.outputHeader, "outputHeader");
        };

        $scope.getDefaults = function() {
            var name = $scope.data.modelName;
            $http.get('/api/modelinfo', {
                "params": {
                    "model_name": name
                }
            }).then(function(response) {
                $scope.defaults.inputs = response.data.input;
                $scope.defaults.outputs = response.data.output;
                $scope.defaults.parameters = response.data.params;
            }).catch(function(data) {
                console.log("Error in getting defaults: ");
                console.log(data);
            });

        };

        $scope.runModel = function(modelType) {
            if (modelType == 'default') {
                var modelurl = '/api/rundefault';
            } else if (modelType == "initialised") {
                var modelurl = '/api/runmodel';
            }
            var runData = $scope.finalChoice;

            $http({
                method: 'POST',
                data: runData,
                url: modelurl,
                headers: {
                    'Content-Type': 'applications/json'
                }
            }).then(function(response) {
                console.log("Running Model");
                console.log(response);
                RunModelData.setModelOutput(response.data);
                $scope.finished = true;
            }).catch(function(data) {
                console.log("Error in running model");
                console.log(data);
                $scope.finished = "error";
            });

        };

        $scope.getLengths = function(x) {
            console.log(x);
            $scope.lengths = _.assign($scope.lengths, _.mapValues(x, function(o) {
                return o.length;
            }));
            console.log($scope.lengths);
            if (Object.keys($scope.lengths).length > 0) {
                $scope.sameLengths = !!Object.values($scope.lengths).reduce(function(a, b) {
                    return (a === b) ? a : NaN;
                });
            }
            console.log($scope.sameLengths);
        };

        // Running code

        $scope.getState();
        $scope.getDefaults();
    }
]);


myApp.controller('SteadyStateController', ['$scope', '$http', '$parse', 'RunModelData',
    function($scope, $http, $parse, RunModelData) {
        // Define variables
        $scope.defaults = {
            "inputs": {},
            "outputs": {},
            "parameters": {}
        };

        $scope.results = {};
        $scope.paco2 = {};
        $scope.pa = {};
        $scope.sao2 = {};
        $scope.direction = "up";

        // Set finished variable to false until response is returned
        $scope.finished = false;
        // Define functions
        $scope.getState = function() {
            $scope.data = RunModelData.getState();
        };

        $scope.saveState = function() {
            RunModelData.setKey($scope.data.parameters, "parameters");
            RunModelData.setKey($scope.results, "results");
        };

        $scope.getDefaults = function() {
            var name = $scope.data.modelName;
            $http.get('/api/modelinfo', {
                "params": {
                    "model_name": name
                }
            }).then(function(response) {
                $scope.defaults.parameters = response.data.params;
                $scope.Pa_co2n = Number($scope.defaults.parameters.Pa_CO2n);
                $scope.SaO2_n = Number($scope.defaults.parameters.SaO2_n);
                $scope.P_an = Number($scope.defaults.parameters.P_an);
                $scope.paco2.max = $scope.Pa_co2n * 2;
                $scope.paco2.min = $scope.Pa_co2n * 0.2;
                $scope.pa.max = $scope.P_an * 1.5;
                $scope.pa.min = $scope.P_an * 0.2;
                $scope.sao2.max = 1.0;
                $scope.sao2.min = 0.2;
            }).catch(function(data) {
                console.log("Error in getting defaults: ");
                console.log(data);
            });

        };


        $scope.runModel = function(input) {

            var modelurl = '/api/steadystate';
            var input_enc = {
                sao2: 'SaO2sup',
                pa: "P_a",
                paco2: "Pa_CO2"
            };
            var runData = {
                "modelName": $scope.data.modelName,
                "direction": $scope.direction,
                "min": $scope[input].min,
                "max": $scope[input].max,
                "params": $scope.data.parameters,
                "inputs": input_enc[input],
                "outputs": [input_enc[input], "CBF"]
            };
            $http({
                method: 'POST',
                data: runData,
                url: modelurl,
                headers: {
                    'Content-Type': 'applications/json'
                }
            }).then(function(response) {
                RunModelData.setSteadyStateOutput(input, response.data);
                RunModelData.setDirection($scope.direction);
                var results = RunModelData.getModelOutput();
                if (Object.keys(results).length === 3) {
                    $scope.finished = true;
                }
            }).catch(function(data) {
                console.log("Error in running model");
                console.log(data);
            });
        };

        $scope.submit = function() {
            ['pa', 'paco2', 'sao2'].forEach(function(input) {
                $scope.results[input] = $scope.runModel(input);
            });
        };

        // Running code

        $scope.getState();
        $scope.getDefaults();
    }
]);

myApp.controller("SteadyStateDisplayController", ['$scope', '$http', '$parse', '$window', 'RunModelData',
    function($scope, $http, $parse, $window, RunModelData) {


        $scope.modelOutput = RunModelData.getModelOutput();
        $scope.direction = RunModelData.getDirection();
        console.log($scope.modelOutput);
        var keys = Object.keys($scope.modelOutput);
        $scope.csvOut = jsonParseToCSV($scope.modelOutput);
        $scope.modelVariables = Object.keys($scope.modelOutput);
    }
]);

myApp.controller("ModelDisplayController", ['$scope', '$http', '$parse', '$window', 'RunModelData',
    function($scope, $http, $parse, $window, RunModelData) {
        $scope.downloadCSV = function(args) {
            var filename, link;
            var csv = args.csv;
            if (csv === null) return;
            filename = args.filename || 'export.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            var data = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        };

        $scope.modelOutput = RunModelData.getModelOutput();
        //var keys = Object.keys($scope.modelOutput);
        $scope.csvOut = jsonParseToCSV($scope.modelOutput);
        $scope.modelVariables = Object.keys($scope.modelOutput);
    }
]);
