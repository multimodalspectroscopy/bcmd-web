from bayescmd.bcmdModel.bcmd_model import ModelBCMD
from nose.tools import assert_true, assert_equal, with_setup
import numpy.testing as np_test
import filecmp
import os

BASEDIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
assert os.path.basename(BASEDIR) == 'BayesCMD'
print(BASEDIR)


def test_create_input_and_run_from_file():
    """
    Check that a full model run will create the correct input file and output data. Uses file creation as input.
    """
    input_file = os.path.join('.', 'test_files', 'test.input')
    actual = os.path.join('.', 'test_files', 'rc_actual.out')
    times = list(range(0, 30, 5))
    inputs = {"names": ['V'],
              "values": [
                  [1],
                  [0],
                  [-1],
                  [0],
                  [1]
    ]
    }
    params = None

    default_model = ModelBCMD('rc',
                              inputs=inputs,
                              params=params,
                              times=times,
                              input_file=input_file,
                              create_input=True,
                              testing=True,
                              workdir=os.path.join('.', 'test_files'),
                              debug=True,
                              basedir=BASEDIR)

    default_model.write_default_input()
    default_model.run_from_file()
    os.remove(default_model.input_file)
    assert_true(filecmp.cmp(default_model.output_coarse, actual),
                msg='Coarse output files do not match actual.')
    os.remove(default_model.output_coarse)
    os.remove(default_model.output_detail)


def test_output_dict_from_file():
    """
    Check that an output file will be read and processed correctly.
    """

    times = list(range(0, 30, 5))
    inputs = {"names": ['V'],
              "values": [
                  [1],
                  [0],
                  [-1],
                  [0],
                  [1]
    ]
    }
    params = None

    default_model = ModelBCMD('rc',
                              inputs=inputs,
                              params=params,
                              times=times,
                              input_file=None,
                              create_input=True,
                              testing=True,
                              workdir=os.path.join('.', 'test_files'),
                              debug=False,
                              basedir=BASEDIR)

    default_model.write_default_input()
    default_model.run_from_file()
    os.remove(default_model.input_file)
    vc_test = default_model.output_parse()['Vc']
    np_test.assert_almost_equal(vc_test, [0.99326201853524232,
                                          0.0066925479138209504,
                                          -0.99321690724584777,
                                          -0.0066922439555526904,
                                          0.99321692632751313],
                                err_msg='Vc Output not the same')
    os.remove(default_model.output_coarse)
    os.remove(default_model.output_detail)


def test_output_dict_from_buffer():
    """
    Check that an output file will be read and processed correctly.
    """

    times = list(range(0, 30, 5))
    inputs = {"names": ['V'],
              "values": [
                  [1],
                  [0],
                  [-1],
                  [0],
                  [1]
    ]
    }
    params = None

    default_model = ModelBCMD('rc',
                              inputs,
                              params,
                              times,
                              input_file=None,
                              create_input=True,
                              testing=True,
                              workdir=os.path.join('.', 'test_files'),
                              debug=False,
                              basedir=BASEDIR)

    default_model.create_default_input()
    default_model.run_from_buffer()
    vc_test = default_model.output_parse()['Vc']
    np_test.assert_almost_equal(vc_test, [0.99326201853524232,
                                          0.0066925479138209504,
                                          -0.99321690724584777,
                                          -0.0066922439555526904,
                                          0.99321692632751313],
                                err_msg='Vc Output not the same')
    os.remove(default_model.output_detail)


def test_create_input_and_run_from_buffer():
    """
    Check that a full model run will create the correct input file and output data. Uses StringIO as model input and output.
    """

    actual = os.path.join('.', 'test_files', 'rc_actual.out')
    times = list(range(0, 30, 5))
    inputs = {"names": ['V'],
              "values": [
                  [1],
                  [0],
                  [-1],
                  [0],
                  [1]
    ]
    }
    params = None

    default_model = ModelBCMD('rc',
                              inputs,
                              params,
                              times,
                              input_file=None,
                              create_input=True,
                              testing=True,
                              workdir=os.path.join('.', 'test_files'),
                              debug=True,
                              basedir=BASEDIR)

    default_model.create_default_input()
    result = default_model.run_from_buffer()
    with open(actual) as f_actual:
        actual_content = f_actual.read()

    assert_equal(result.stdout.decode(), actual_content)
    os.remove(default_model.output_detail)


def test_init_output_from_buffer():
    """
    Check that an output file will be read and processed correctly.
    """

    times = [0, 2, 4, 12, 15, 25]
    inputs = {"names": ['V'],
              "values": [
                  [5],
                  [0],
                  [15],
                  [-8],
                  [25]
    ]
    }
    params = {"C": 0.0121805,
              "R": 1000,
              "Vc": 0}

    outputs = ['Vc']

    init_model = ModelBCMD('rc',
                           inputs=inputs,
                           params=params,
                           times=times,
                           outputs=outputs,
                           input_file=None,
                           create_input=True,
                           testing=True,
                           workdir=os.path.join('.', 'test_files'),
                           debug=False,
                           basedir=BASEDIR)

    init_model.create_initialised_input()
    result = init_model.run_from_buffer()
    vc_test = init_model.output_parse()
    out = outputs[0]
    np_test.assert_almost_equal(vc_test[out], [5,
                                               4.2428747349702212,
                                               9.4222756529437621,
                                               5.6188422186969031,
                                               16.472322944130664],
                                err_msg='Vc Output not the same')
    os.remove(init_model.output_detail)


def test_init_output_from_file():
    """
    Check that an output file will be read and processed correctly.
    """

    times = [0, 2, 4, 12, 15, 25]
    inputs = {"names": ['V'],
              "values": [
                  [5],
                  [0],
                  [15],
                  [-8],
                  [25]
    ]
    }
    params = {"C": 0.0121805,
              "R": 1000,
              "Vc": 0}

    outputs = ['Vc']

    init_model = ModelBCMD('rc',
                           inputs=inputs,
                           params=params,
                           times=times,
                           outputs=outputs,
                           input_file=None,
                           create_input=True,
                           testing=True,
                           workdir=os.path.join('.', 'test_files'),
                           debug=False,
                           basedir=BASEDIR)

    init_model.write_initialised_input()
    result = init_model.run_from_file()
    vc_test = init_model.output_parse()
    out = outputs[0]
    np_test.assert_almost_equal(vc_test[out], [5,
                                               4.2428747349702212,
                                               9.4222756529437621,
                                               5.6188422186969031,
                                               16.472322944130664],
                                err_msg='Vc Output not the same')
    os.remove(init_model.input_file)
    os.remove(init_model.output_detail)
