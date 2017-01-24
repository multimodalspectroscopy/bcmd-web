import numpy as np

# All functions here can expect to handle the output as a numpy struct array.

class DistanceMeasures:
    def __init__(self, simulation_data, actual_data):
        self.actual_data = actual_data

        # Only check arrays in sim_data that match those in array_data
        try:
            self.sim_data = simulation_data[self.actual_data.dtype.names]
        except:

    def euclidean_dist():
        return [numpy.sqrt(numpy.sum((data1 - data2) * (data1 - data2)))]
