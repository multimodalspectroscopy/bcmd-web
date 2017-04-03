import numpy as np
from .data_import import *
# All functions here can expect to handle the output from BCMD Model i.e.
# a dict.


def euclidean_dist(data1, data2):
    """
    Gives the euclidean distance between two numpy arrays.

    :param data1: Numpy array for data1
    :type data1: np.ndarray
    :param data2: Numpy array for data2
    :type data2: np.ndarray

    :return: Euclidean distance measure
    :rtype: list of float
    """
    try:
        assert(data1.shape == data2.shape), 'Arrays not of equal size'
    except AssertionError as e:
        print(e)
        print("\tData 1: ", data1.shape)
        print("\tData 2: ", data2.shape)

    return np.sum(np.sqrt(np.sum((data1 - data2) * (data1 - data2), axis=1)))


def manhattan_dist(data1, data2):
    """
    Gives the Manhattan distance between two numpy arrays.

    :param data1: Numpy array for data1
    :type data1: np.ndarray
    :param data2: Numpy array for data2
    :type data2: np.ndarray

    :return: Manhattan distance measure
    :rtype: list of float
    """
    assert(data1.shape == data2.shape), 'Arrays not of equal size'
    return np.sum(np.abs(data1 - data2))


def mean_square_error_dist(data1, data2):
    """
    Gives the mean squared error between two numpy arrays.

    :param data1: Numpy array for data1
    :type data1: np.ndarray
    :param data2: Numpy array for data2
    :type data2: np.ndarray

    :return: MSE distance measure
    :rtype: list of float
    """
    assert(data1.shape == data2.shape), 'Arrays not of equal size'
    n = data1.shape[1]
    return np.sum(1 / n * np.sum((data1 - data2) * (data1 - data2), axis=1))


def mean_absolute_error_dist(data1, data2):
    """
    Gives the normalised manhattan distance between two numpy arrays.

    :param data1: Numpy array for data1
    :type data1: np.ndarray
    :param data2: Numpy array for data2
    :type data2: np.ndarray

    :return: MAE distance measure
    :rtype: list of float
    """
    assert(data1.shape == data2.shape), 'Arrays not of equal size'
    n = data1.shape[1]
    return 1 / n * np.sum(np.abs(data1 - data2))


DISTANCES = {
    'euclidean': euclidean_dist,
    'manhattan': manhattan_dist,
    'MSE': mean_square_error_dist,
    'MAE': mean_absolute_error_dist
}


def check_for_key(dictionary, target):
    try:
        data = dictionary[target]
    except KeyError:
        print('Actual data does not contain target value.')
    return data


def zero_array(array):
    """
    Method to zero an array of data with the initial values.
    :param array: Array of data - rows are time points, columns are signals.
    :return: Zero'd numpy array
    :rtype: np.ndarray
    """
    init = array[:, 0]
    zerod = np.apply_along_axis(lambda x: x - init, 0, array)
    return zerod

def get_distance(actual_data, sim_data, targets,
                 distance='euclidean', zero=False):

    d0 = []
    d_star = []
    for idx, k in enumerate(targets):
        d0.append(check_for_key(actual_data, k))
        d_star.append(check_for_key(sim_data, k))
    if zero:
        try:
            d_star = zero_array(np.array(d_star))
        except (TypeError, IndexError):
            print('Invalid Data')
            return (float('NaN'))

    return DISTANCES[distance](np.array(d0), np.array(d_star))
