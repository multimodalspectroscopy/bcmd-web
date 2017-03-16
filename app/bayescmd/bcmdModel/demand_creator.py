import numpy as np


def topHat(length, peak=2.0, default=1.0):
    """
    Generate a single 'top hat' demand signal

    Inputs:
    :param length: length of signal in time points i.e. 10 sec at 1Hz
    or 5 sec at 2Hz
    :type length: integer
    :param peak: Peak of the top hat signal
    :type peak: float

    Outputs:
    :return: array of signal
    :rtype: np.ndarray
    """

    return np.ones(length) * peak


def sinusoidal(length, peak=2.0, default=1.0):
    """
    Generate a single 'sinusoidal wavelet' demand signal

    Inputs:
    :param length: length of signal in time points i.e. 10 sec at 1Hz
    or 5 sec at 2Hz
    :type length: integer
    :param default: default demand signal value
    :type default: float
    :param peak: Peak of the top hat signal
    :type peak: float

    Outputs:
    :return: array of signal
    :rtype: np.ndarray
    """

    t = np.arange(0, length)
    return (peak * np.sin(np.pi * t / length)) + default


def signalGenerator(start, end, peaks,
                    sample_rate=1.0, default=1.0):
    """
    Method to create a single signal of one or more demand pulses of the same
    type.

    Inputs:
    :param start: start time
    :type start: float
    :param end: end time
    :type end: float
    :param peaks: list of tuples, each containing the start and end of
    that demand pulse, followed by the peak of the signal and the peak type.
    :type peaks: list
    :param sample_rate: sample rate for the signal
    :type sample_rate: float
    :param default: Default demand signal value
    :type default: float

    Outputs:
    :return: numpy array of length (end-start)/sample_rate
    :rtype: np.ndarray
    """

    SIGNAL = {
        'top-hat': topHat,
        'sinusoidal': sinusoidal
    }
    print((end - start) / sample_rate)
    signal = np.ones(int((end - start) / sample_rate)) * default

    for idx, demand in enumerate(peaks):
        try:
            float(demand[0])
        except ValueError:
            print('demand start time for peak %d given as %s' %
                  (idx, demand[0]))
            raise

        try:
            float(demand[1])
        except ValueError:
            print('demand end time for peak %d given as %s' % (idx, demand[1]))
            raise

        try:
            assert demand[3] in SIGNAL.keys()
        except AssertionError:
            print('Peak type not recognised')
            raise

        config = {'length': int((demand[1] - demand[0]) / sample_rate),
                  'default': default,
                  'peak': demand[2]}

        peak = SIGNAL[demand[3]](**config)

        signal[demand[0]:demand[1]] = peak

    return signal
