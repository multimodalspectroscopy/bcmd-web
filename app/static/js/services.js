myApp.factory('RunModelData', function() {
    var inputs = {};
    var inputHeader = {};
    var outputs = {};
    var outputHeader = {};

    var data = {
        inputHeader: {},
        inputs: {},
        outputHeader: {},
        outputs: {}
    };

    function getState() {
        return data;
    }

    function clearInput() {
        data.inputs = {};
        data.inputHeader = {};
    }

    function clearOutput() {
        data.outputs = {};
        data.outputHeader = {};
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
        setKey: setKey,
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
