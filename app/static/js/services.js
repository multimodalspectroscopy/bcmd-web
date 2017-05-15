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

    function getState() {
        return Object.assign({}, data);
    }

    function setModel(model) {
        data.modelName = model;
    }

    function setModelOutput(modelResponse){
        modelOutput = modelResponse;
        modelOutput = modelResponse;
    }

    function getModelOutput(){
        return Object.assign({}, modelOutput);
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
        console.log("SETTING: " + key + " TO: " + JSON.stringify(newVal));
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
        getModelOutput: getModelOutput,
        clearData: clearData,
        clearInput: clearInput,
        clearOutput: clearOutput,
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
