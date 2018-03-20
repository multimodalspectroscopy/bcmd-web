from ..bayescmd.bcmdModel import *
from ..bayescmd.abc import data_import


class inputParsing:
    """
    This class will parse various inputs in order to create a data structure
    that can be passed to inputCreation.

    Inputs:
    ======
    :param csvfile: Path to a csv file containing input data.
    :param inputs: list of model inputs
    :param params: Dictionary of parameters and values {{key: val}}
    :param outputs: List of output values as string.
    :param demand: a demand time signal as created by demand_creator. \
    Default: None
    :param time: A tuple of (start, end, sample_rate). Default: None
    """

    @staticmethod
    def _timeGenerator(start_time, end_time, sample_rate):
        return list(np.arange(start_time, end_time, sample_rate))

    def __init__(self, csvfile, inputs, params, outputs, demand=None,
                 time=None):
        self.file = csvfile
        self.inputs = inputs
        self.demand = demand
        self.params = params
        self.outputs = outputs
        self.time = time

    def processInputs(self):
        d0 = data_import.import_actual_data(self.file)
        self.input_dict = data_import.inputParse(d0, self.inputs)
        if self.time is not None:
            self.input_dict['t'] = _timeGenerator(*self.time)
        if demand is not None:
            assert type(demand) == np.ndarray, 'Demand not type "np.ndarray"'
            self.input_dict['u'] = self.demand
        return self.input_dict
