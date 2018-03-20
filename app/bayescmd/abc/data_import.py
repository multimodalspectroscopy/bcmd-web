import csv
import sys
from itertools import zip_longest


def import_actual_data(fname):
    """
    Method to parse a csv of data into the correct format for comparing with simulated data.

    Inputs:
    ======
    :param fname: Filepath/filename of the actual data to parse
    :type fname: str

    Returns:
    =======
    :return: Dictionary of actual data. Keys are columns headers, values are lists of data.
    :rtype: dict
    """

    actual_data = {}
    with open(fname, "r") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=",")
        for row in reader:
            for k in row.keys():
                try:
                    actual_data.setdefault(k.strip(), []).append(float(row[k]))
                except ValueError as e:
                    print(e)
                    sys.exit(1)
    return actual_data


def inputParse(d0, inputs):
    """
    Inputs
    ======
    :param d0: Dictionary created from import_actual_data
    :type d0: dict

    :param inputs: List of input names
    :type list:

    :return: Dictionary of inputs as used by bcmdModel
    :rtype: dict
    """
    values = [l for k, l in d0.items() if k in inputs]
    return {"names": [k for k in d0.keys() if k in inputs],
            "values": list(map(list, zip(*values)))}
