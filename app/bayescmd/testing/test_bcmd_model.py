from ..bcmdModel.bcmd_model import ModelBCMD
from nose.tools import assert_true, assert_equal
import numpy.testing as np_test
import filecmp
import os

BASEDIR = '../../..'


def test_default_output():
    """
    Check that a full model run will create the correct input file and
    output data. Uses file creation as input.
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
                              inputs,
                              params,
                              times,
                              input_file=input_file,
                              input_required=True,
                              testing=True,
                              workdir=os.path.join('.', 'test_files'),
                              debug=True,
                              basedir=BASEDIR)

    default_model.write_default_input()
    default_model.run()
    os.remove(input_file)
    assert_true(filecmp.cmp(default_model.output_coarse, actual),
                msg='Coarse output files do not match actual.')
    os.remove(default_model.output_coarse)
    os.remove(default_model.output_detail)


def test_output_dict():
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
                              input_required=True,
                              testing=True,
                              workdir=os.path.join('.', 'test_files'),
                              debug=False,
                              basedir=BASEDIR)

    default_model.write_default_input()
    default_model.run()
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


def test_output_dict_2():
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
                              input_required=True,
                              testing=True,
                              workdir=os.path.join('.', 'test_files'),
                              debug=False,
                              basedir=BASEDIR)

    default_model.write_default_input_2()
    default_model.run_2()
    vc_test = default_model.output_parse()['Vc']
    np_test.assert_almost_equal(vc_test, [0.99326201853524232,
                                          0.0066925479138209504,
                                          -0.99321690724584777,
                                          -0.0066922439555526904,
                                          0.99321692632751313],
                                err_msg='Vc Output not the same')
    os.remove(default_model.output_detail)


def test_default_BrainSignals():
    """
    Check that a full model run will create the correct input file and
    output data. Uses file creation as input.
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
                              inputs,
                              params,
                              times,
                              input_file=input_file,
                              input_required=True,
                              testing=True,
                              workdir=os.path.join('.', 'test_files'),
                              debug=True,
                              basedir=BASEDIR)

    default_model.write_default_input()
    default_model.run()
    os.remove(input_file)
    assert_true(filecmp.cmp(default_model.output_coarse, actual),
                msg='Coarse output files do not match actual.')
    os.remove(default_model.output_coarse)
    os.remove(default_model.output_detail)


def test_default_output_2():
    """
    Check that a full model run will create the correct input file and output
    data. Uses StringIO as model input and output.
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

    default_model_2 = ModelBCMD('rc',
                                inputs,
                                params,
                                times,
                                input_file=None,
                                input_required=True,
                                testing=True,
                                workdir=os.path.join('.', 'test_files'),
                                debug=True,
                                basedir=BASEDIR)

    default_model_2.write_default_input_2()
    result = default_model_2.run_2()
    with open(actual) as f_actual:
        actual_content = f_actual.read()

    assert_equal(result.stdout.decode(), actual_content)
    os.remove(default_model_2.output_detail)
