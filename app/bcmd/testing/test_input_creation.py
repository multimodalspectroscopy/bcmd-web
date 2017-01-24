from new_code.input_creation import InputCreator
from nose.tools import assert_equal
import os

def test_default_creation():
    """
    Nose test function to check that the default creation function outputs the same as a test file.
    :return: None - checks output files are the same
    """
    output = os.path.join('.','test_files','test_default.input')
    actual = os.path.join('.','test_files','rc_test_default.input')
    times = list(range(0,30,5))
    params={"names":['V'],
            "values":[
                [1],
                [0],
                [-1],
                [0],
                [1]
            ]
    }
    input_creator = InputCreator(output, times, params)
    input_creator.default_creation()
    with open(output) as f_output, open(actual) as f_actual:
        content = f_output.read()
        actual_content = f_actual.read()

    assert_equal(content, actual_content)
    os.remove(output)

def test_default_creation_2():
    """
    Test the StringIO creation method
    """
    actual = os.path.join('.', 'test_files', 'rc_test_default.input')
    times = list(range(0, 30, 5))
    params = {"names": ['V'],
              "values": [
                  [1],
                  [0],
                  [-1],
                  [0],
                  [1]
              ]
              }
    input_creator = InputCreator(None, times, params)
    f_out = input_creator.default_creation_2()
    with open(actual) as f_actual:
        actual_content = f_actual.read()

    content = f_out.getvalue()

    assert_equal(content, actual_content)


