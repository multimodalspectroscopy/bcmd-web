from nose.tools import assert_equal
import os

from bayescmd.bcmdModel.input_creation import InputCreator
from bayescmd.util import *

BASEDIR = findBaseDir('app', verbose=True)
print("BASEDIR:\t%s" % os.path.abspath(BASEDIR))
TESTDIR = os.path.abspath(os.path.dirname(__file__))


class TestInputDefault:

    def setUp(self):
        self.times = list(range(0, 30, 5))
        self.inputs = {"names": ['V'],
                       "values": [
            [1],
            [0],
            [-1],
            [0],
            [1]
        ]
        }
        self.actual = os.path.join(TESTDIR,
                                   'test_files',
                                   'rc_test_default.input')

    def test_default_creation(self):
        """
        Test the StringIO creation method
        """
        input_creator = InputCreator(self.times, self.inputs)
        f_out = input_creator.default_creation()
        with open(self.actual) as f_actual:
            actual_content = f_actual.read()

        content = f_out.getvalue()

        assert_equal(content, actual_content)

    def test_input_file_write(self):
        """
        Nose test function to check that the default creation function outputs the same as a test file.
        :return: None - checks output files are the same
        """
        output = os.path.join(TESTDIR, 'test_files', 'test_default.input')
        input_creator = InputCreator(self.times, self.inputs, filename=output)
        input_creator.default_creation()
        input_creator.input_file_write()

        with open(output) as f_output, open(self.actual) as f_actual:
            content = f_output.read()
            actual_content = f_actual.read()

        assert_equal(content, actual_content)
        os.remove(output)
