import numpy
import numpy.random
import pprint
import tempfile
import shutil
import csv
import os
import copy
import sys
import datetime

import subprocess
from io import StringIO

import collections
from .input_creation import InputCreator
from ..util import findBaseDir

# default timeout, in seconds
TIMEOUT = 30
# default base directory - this should be a relative directory path
# leading to bcmd/
BASEDIR = findBaseDir('bcmd-web')


class ModelBCMD:
    """
    BCMD model class. this can be used to create inputs, run simulations etc.
    """

    def __init__(self,
                 model_name,
                 inputs=None,  # Input variables
                 params=None,  # Parameters
                 times=None,  # Times to run simulation at
                 outputs=None,
                 burn_in=999,
                 create_input=True,
                 input_file=None,
                 suppress=False,
                 workdir=None,  # default is to create a temp directory
                 # not quite sure when the best time for this is, probably in
                 # __del__?
                 deleteWorkdir=False,
                 timeout=TIMEOUT,
                 basedir=BASEDIR,
                 debug=False,
                 testing=False):

        self.model_name = model_name
        self.params = params  # dict of non-default params
        self.inputs = inputs  # any time dependent inputs to the model
        self.times = times
        self.outputs = outputs
        self.burn_in = burn_in

        # Determine if input file is present already or if it needs creating
        self.create_input = create_input

        # Suppression of output files
        self.suppress = suppress
        if suppress:
            self.DEVNULL = open(os.devnull, 'wb')

        # we need working space; we may want to kill it later
        self.deleteWorkdir = deleteWorkdir

        if workdir:
            self.workdir = workdir

            if not os.path.exists(workdir):
                os.makedirs(workdir)
        else:
            self.workdir = tempfile.mkdtemp(prefix=model_name)
            self.deleteWorkdir = True
            if debug:
                print('TEMP DIR: ', self.workdir)

        self.timeout = timeout
        self.debug = debug

        if input_file is not None:
            self.input_file = input_file
        elif create_input:
            self.input_file = os.path.join(
                self.workdir, self.model_name + '.input')
        else:
            self.input_file = None

        if testing:
            TEST_PRE = '_test'
        else:
            TEST_PRE = ''

        self.basedir = basedir
        self.program = os.path.join(
            self.basedir, 'build', self.model_name + '.model')
        self.output_coarse = os.path.join(
            self.workdir, self.model_name + TEST_PRE + '.out')
        self.output_detail = os.path.join(
            self.workdir, self.model_name + TEST_PRE + '.detail')
        self.output_dict = collections.defaultdict(list)

    def _cleanupTemp(self):
        if self.deleteWorkdir:
            shutil.rmtree(self.workdir)
        return None

    def get_defaults(self):
        print('GETTING MODEL DEFAULTS.\n')
        return subprocess.run([self.program, '-s'], stdout=subprocess.PIPE)

    def write_default_input(self):
        """
        Function to write a default input to file.
        """
        # Ensure that any existing input files aren't overwritten
        try:
            assert os.path.exists(self.input_file)
            new_input = os.path.splitext(self.input_file)[
                0] + '_{:%H%M%S-%d%m%y}.input'.format(datetime.datetime.now())
            print('Input file %s already exists.\n Renaming as %s' %
                  (self.input_file, new_input))
            input_creator = InputCreator(self.times, self.inputs,
                                         filename=new_input)
            input_creator.default_creation()
            self.input_file = input_creator.input_file_write()
        except AssertionError:
            input_creator = InputCreator(self.times,
                                         self.inputs,
                                         filename=self.input_file)
            input_creator.default_creation()
            input_creator.input_file_write()

        return True

    def create_default_input(self):
        """
        Method to create input file and write to string buffer for acces
        direct from memory.
        """
        input_creator = InputCreator(self.times, self.inputs)
        self.input_file = input_creator.default_creation().getvalue()

        return self.input_file

    def write_initialised_input(self):
        """
        Function to write a default input to file.
        """
        # Ensure that any existing input files aren't overwritten
        try:
            assert os.path.exists(self.input_file)
            new_input = os.path.splitext(self.input_file)[
                0] + '_{:%H%M%S-%d%m%y}.input'.format(datetime.datetime.now())
            print('Input file %s already exists.\n Renaming as %s' %
                  (self.input_file, new_input))
            input_creator = InputCreator(self.times, self.inputs,
                                         params=self.params,
                                         outputs=self.outputs,
                                         filename=new_input)
            input_creator.initialised_creation(self.burn_in)
            self.input_file = input_creator.input_file_write()
        except AssertionError:
            input_creator = InputCreator(self.times,
                                         self.inputs,
                                         params=self.params,
                                         outputs=self.outputs,
                                         filename=self.input_file)
            input_creator.initialised_creation(self.burn_in)
            input_creator.input_file_write()

        return True

    def create_initialised_input(self):
        """
        Method to create input file and write to string buffer for access
        direct from memory.
        """
        input_creator = InputCreator(self.times, self.inputs,
                                     params=self.params, outputs=self.outputs)
        f_out = input_creator.initialised_creation(self.burn_in)

        if self.debug:
            print(f_out.getvalue(), file=sys.stderr)
            f_out.seek(0)

        self.input_file = f_out.getvalue()

        return self.input_file

    def run_from_file(self):
        try:
            assert os.path.exists(self.input_file)
            if self.debug:
                print("\n\nOutput goes to:\n\tCOARSE:%s\n\tDETAIL:%s\n\n" %
                      (self.output_coarse, self.output_detail))
            if self.suppress:
                # invoke the model program as a subprocess
                succ = subprocess.run([self.program,
                                       '-i', self.input_file,
                                       '-o', self.output_coarse,
                                       '-d', self.output_detail],
                                      stdout=self.DEVNULL,
                                      stderr=self.DEVNULL,
                                      timeout=self.timeout)
            else:
                stdoutname = os.path.join(
                    self.workdir, '%s.stdout' % (self.model_name))
                stderrname = os.path.join(
                    self.workdir, '%s.stderr' % (self.model_name))

                # if opening these files fails, we may be in trouble anyway
                # but don't peg out just because of this -- let the the failure
                # happen somewhere more important
                try:
                    f_out = open(stdoutname, 'w')
                except IOError:
                    f_out = None

                try:
                    f_err = open(stderrname, 'w')
                except IOError:
                    f_err = None

                # invoke the model program as a subprocess
                succ = subprocess.run([self.program,
                                       '-i', self.input_file,
                                       '-o', self.output_coarse,
                                       '-d', self.output_detail],
                                      stdout=f_out,
                                      stderr=f_err,
                                      timeout=self.timeout)

                if f_out:
                    f_out.close()
                if f_err:
                    f_err.close()
        except AssertionError:
            print("Input file doesn't exist. Can't run from file.")

        return None

    def run_from_buffer(self):

        # Ensure that input file has seeked to 0
        if self.debug:
            print("Output goes to:\n\tCOARSE:%s\n\tDETAIL:%s" %
                  (self.output_coarse, self.output_detail))
        if self.suppress:
            # invoke the model program as a subprocess
            result = subprocess.run([self.program,
                                     '-I'],
                                    input=self.input_file.encode(),
                                    stdout=subprocess.PIPE,
                                    stderr=self.DEVNULL,
                                    timeout=self.timeout)
        else:
            stderrname = os.path.join(
                self.workdir, '%s.stderr' % ("buffer_" + self.model_name))

            # if opening these files fails, we may be in trouble anyway
            # but don't peg out just because of this -- let the the failure
            # happen somewhere more important

            try:
                f_err = open(stderrname, 'w')
            except IOError:
                f_err = None

            # invoke the model program as a subprocess
            result = subprocess.run([self.program,
                                     '-I',
                                     '-d', self.output_detail],
                                    input=self.input_file.encode(),
                                    stdout=subprocess.PIPE,
                                    stderr=f_err,
                                    timeout=self.timeout)

            if f_err:
                f_err.close()

        self.output_coarse = StringIO(result.stdout.decode())

        if self.debug:
            pprint.pprint('OUTPUT: ' + self.output_coarse.getvalue(), stream=sys.stderr)
            self.output_coarse.seek(0)
        return result

    def output_parse(self):
        """
        Function to parse the output files into a dictionary.
        """
        # Check if file is open

        try:
            file_out = open(self.output_coarse)
        except TypeError:
            file_out = self.output_coarse

        if self.debug:
            pprint.pprint(file_out.read(), stream=sys.stderr)
            file_out.seek(0)

        for d in csv.DictReader(file_out, delimiter='\t'):
            for key, value in d.items():
                if key == 'ERR':
                    pass
                else:
                    try:
                        self.output_dict[key].append(float(value))
                    except (ValueError, TypeError) as e:
                        self.output_dict[key].append('NaN')

        self._cleanupTemp()
        return self.output_dict
