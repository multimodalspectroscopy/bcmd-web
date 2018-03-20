myApp.factory('RunModelData', function() {
    var inputs = {};
    var inputHeader = {};
    var outputs = {};
    var outputHeader = {};

    var data = {
        modelName: "",
        inputHeader: {},
        inputs: {},
        inputKeys: [],
        outputHeader: {},
        outputs: {},
        outputKeys: [],
        parameters: {}
    };

    var modelOutput = {};

    var dir;

    function getState() {
        return Object.assign({}, data);
    }

    function setModel(model) {
        data.modelName = model;
    }

    function setModelOutput(modelResponse){
        modelOutput = modelResponse;
    }

    function setDirection(direction){
        dir = direction;
    }

    function getDirection(direction){
        return dir;
    }

    function getModelOutput(){
        return Object.assign({}, modelOutput);
    }

    function setSteadyStateOutput(input, modelResponse){
      modelOutput[input] = modelResponse;
    }

    function clearInput() {
        data.inputs = {};
        data.inputHeader = {};
    }

    function clearOutput() {
        data.outputs = {};
        data.outputHeader = {};
    }

    function clearData() {
        data = {
            modelName: "",
            inputHeader: {},
            inputs: {},
            inputKeys: [],
            outputHeader: {},
            outputs: {},
            outputKeys: [],
            parameters: {}
        };
    }

    function setKey(newVal, key) {
        if (data.hasOwnProperty(key)) {
            data[key] = newVal;
        }
    }


    function getInput() {
        return inputs;
    }

    function getInputHeader() {
        return inputHeader;
    }

    function getOutput() {
        return outputs;
    }

    function getOutputHeader() {
        return outputHeader;
    }

    return {
        getState: getState,
        setModel: setModel,
        setKey: setKey,
        setModelOutput: setModelOutput,
        setSteadyStateOutput: setSteadyStateOutput,
        getModelOutput: getModelOutput,
        clearData: clearData,
        clearInput: clearInput,
        clearOutput: clearOutput,
        setDirection: setDirection,
        getDirection: getDirection
    };
});

myApp.factory('PeakTypes', function() {
    var data = [{
            "name": "Top Hat",
            "image": "/static/images/peaks/tophat.png",
            "function": "top-hat"
        },
        {
            "name": "Wavelet",
            "image": "/static/images/peaks/wavelet.png",
            "function": "sinusoidal"
        }
    ];

    function getPeaks() {
        return data;
    }

    return {
        getPeaks: getPeaks
    };
});
