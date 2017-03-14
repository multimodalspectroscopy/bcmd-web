from bayescmd.bcmdModel.bcmd_model import ModelBCMD
from bayescmd.util import *
from nose.tools import assert_true, assert_equal
import numpy.testing as np_test
import filecmp
import os

BASEDIR = findBaseDir('bcmd-web', verbose=True)
print("BASEDIR:\t%s" % os.path.abspath(BASEDIR))
TESTDIR = os.path.abspath(os.path.dirname(__file__))


class testDefault:

    def setUp(self):
        self.input_file = os.path.join(TESTDIR, 'test_files', 'test.input')
        self.actual = os.path.join(TESTDIR, 'test_files', 'rc_actual.out')
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
        self.params = None

    def tearDown(self):
        try:
            os.remove(self.model.input_file)
        except (FileNotFoundError, TypeError):
            pass
        try:
            os.remove(self.model.output_coarse)
        except (FileNotFoundError, TypeError):
            pass
        try:
            os.remove(self.model.output_detail)
        except (FileNotFoundError, TypeError):
            pass

    def test_create_input_and_run_from_file(self):
        """
        Check that a full model run will create the correct input file and output data. Uses file creation as input.
        """

        self.model = ModelBCMD('rc',
                               inputs=self.inputs,
                               params=self.params,
                               times=self.times,
                               input_file=self.input_file,
                               create_input=True,
                               testing=True,
                               workdir=os.path.join(TESTDIR, 'test_files'),
                               debug=True,
                               suppress=True,
                               basedir=BASEDIR)

        self.model.write_default_input()
        self.model.run_from_file()

        assert_true(filecmp.cmp(self.model.output_coarse, self.actual),
                    msg='Coarse output files do not match actual.')

    def test_output_dict_from_file(self):
        """
        Check that an output file will be read and processed correctly.
        """

        self.model = ModelBCMD('rc',
                               inputs=self.inputs,
                               params=self.params,
                               times=self.times,
                               input_file=None,
                               create_input=True,
                               testing=True,
                               workdir=os.path.join(TESTDIR, 'test_files'),
                               debug=False,
                               suppress=True,
                               basedir=BASEDIR)

        self.model.write_default_input()
        self.model.run_from_file()
        vc_test = self.model.output_parse()['Vc']
        np_test.assert_almost_equal(vc_test, [0.99326201853524232,
                                              0.0066925479138209504,
                                              -0.99321690724584777,
                                              -0.0066922439555526904,
                                              0.99321692632751313],
                                    err_msg='Vc Output not the same')

    def test_output_dict_from_buffer(self):
        """
        Check that an output file will be read and processed correctly.
        """
        self.model = ModelBCMD('rc',
                               inputs=self.inputs,
                               params=self.params,
                               times=self.times,
                               input_file=None,
                               create_input=True,
                               testing=True,
                               workdir=os.path.join(TESTDIR, 'test_files'),
                               debug=False,
                               suppress=True,
                               basedir=BASEDIR)

        self.model.create_default_input()
        self.model.run_from_buffer()
        vc_test = self.model.output_parse()['Vc']
        np_test.assert_almost_equal(vc_test, [0.99326201853524232,
                                              0.0066925479138209504,
                                              -0.99321690724584777,
                                              -0.0066922439555526904,
                                              0.99321692632751313],
                                    err_msg='Vc Output not the same')

    def test_create_input_and_run_from_buffer(self):
        """
        Check that a full model run will create the correct input file and output data. Uses StringIO as model input and output.
        """

        self.model = ModelBCMD('rc',
                               inputs=self.inputs,
                               params=self.params,
                               times=self.times,
                               input_file=None,
                               create_input=True,
                               testing=True,
                               workdir=os.path.join(TESTDIR, 'test_files'),
                               debug=True,
                               suppress=True,
                               basedir=BASEDIR)

        self.model.create_default_input()
        result = self.model.run_from_buffer()
        with open(self.actual) as f_actual:
            actual_content = f_actual.read()

        assert_equal(result.stdout.decode(), actual_content)


class testInitialised:

    def setUp(self):
        self.times = [0, 2, 4, 12, 15, 25]
        self.inputs = {"names": ['V'],
                       "values": [
            [5],
            [0],
            [15],
            [-8],
            [25],
            [0]
        ]
        }
        self.params = {"C": 0.0121805,
                       "R": 1000,
                       "Vc": 0}

        self.outputs = ['Vc']

    def tearDown(self):
        #try:
        #    os.remove(self.model.output_coarse)
        #except (FileNotFoundError, TypeError):
    #        pass
        #try:
    #        os.remove(self.model.input_file)
    #    except (FileNotFoundError, TypeError):
    #        pass
        try:
            os.remove(self.model.output_detail)
        except (FileNotFoundError, TypeError):
            pass

    def test_init_output_from_buffer(self):
        """
        Check that an output file will be read and processed correctly.
        """

        self.model = ModelBCMD('rc',
                               inputs=self.inputs,
                               params=self.params,
                               times=self.times,
                               outputs=self.outputs,
                               input_file=None,
                               create_input=True,
                               testing=True,
                               workdir=os.path.join(TESTDIR, 'test_files'),
                               debug=False,
                               suppress=True,
                               basedir=BASEDIR)

        self.model.create_initialised_input()
        result = self.model.run_from_buffer()
        vc_test = self.model.output_parse()
        out = self.outputs[0]
        np_test.assert_almost_equal(vc_test[out], [5,
                                                   4.2428747349702212,
                                                   5.8717730134973181,
                                                   -0.80728597087174025,
                                                   4.8266677606599329,
                                                   2.1237257717723548],
                                    err_msg='Vc Output not the same')

    def test_init_output_from_file(self):
        """
        Check that an output file will be read and processed correctly.
        """
        self.model = ModelBCMD('rc',
                               inputs=self.inputs,
                               params=self.params,
                               times=self.times,
                               outputs=self.outputs,
                               input_file=None,
                               create_input=True,
                               testing=True,
                               workdir=os.path.join(TESTDIR, 'test_files'),
                               debug=False,
                               suppress=True,
                               basedir=BASEDIR)

        self.model.write_initialised_input()
        result = self.model.run_from_file()
        vc_test = self.model.output_parse()
        out = self.outputs[0]
        np_test.assert_almost_equal(vc_test[out], [5,
                                                   4.2428747349702212,
                                                   5.8717730134973181,
                                                   -0.80728597087174025,
                                                   4.8266677606599329,
                                                   2.1237257717723548],
                                    err_msg='Vc Output not the same')
