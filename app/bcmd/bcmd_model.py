import numpy
import numpy.random
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

# default timeout, in seconds
TIMEOUT = 30
#default base directory - this should be a relative directory path leading to bcmd/
BASEDIR = '..'




class ModelBCMD:
    """
    BCMD model class. this can be used to create inputs, run simulations etc.
    """
    def __init__(self,
                 model_name,
                 inputs, # Output variables
                 params, # Parameters
                 times, # Times to run simulation at
                 input_file=None,
                 suppress=False,
                 workdir=None,  # default is to create a temp directory
                 # not quite sure when the best time for this is, probably in
                 # __del__?
                 deleteWorkdir=False,
                 input_required=True,
                 timeout=TIMEOUT,
                 basedir=BASEDIR,
                 debug=False,
                 testing=False):


        self.model_name = model_name
        self.params = params # Appears to be a dictionary in existing code
        self.inputs = inputs # Appears to be a dictionary in existing code
        self.times = times

        # Determine if input file is present already or if it needs creating
        self.input_required = input_required

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
            print(self.workdir)

        self.timeout = timeout
        self.debug = debug

        if input_file is not None:
            self.input_file=input_file
        else:
            self.input_file = os.path.join(self.workdir,self.model_name+'.input')

        if testing:
            TEST_PRE = '_test'
        else:
            TEST_PRE = ''

        self.basedir = basedir
        self.program = os.path.join(self.basedir,'build', self.model_name+'.model')
        self.output_coarse = os.path.join(self.workdir, self.model_name+TEST_PRE+'.out')
        self.output_detail = os.path.join(self.workdir, self.model_name+TEST_PRE+'.detail')
        self.output_dict = collections.defaultdict(list)


    def run(self):

        if self.debug:
            print("Output goes to:\n\tCOARSE:%s\n\tDETAIL:%s"%(self.output_coarse,self.output_detail))
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

        return None



    def write_default_input(self):
        # Ensure that any existing input files aren't overwritten
        try:
            assert not os.path.exists(self.input_file)
            input_creator = InputCreator(self.input_file, self.times, self.inputs)
            input_creator.default_creation()
        except:
            new_input = os.path.splitext(self.input_file)[0]+'_{:%H%M%S-%d%m%y}.input'.format(datetime.datetime.now())
            print('Input file %s already exists.\n Renaming as %s' %(self.input_file, new_input))
            input_creator = InputCreator(new_input, self.times, self.inputs)
            input_creator.default_creation()

        return True

    def write_default_input_2(self):
        """
        Method to write input file to string buffer for access direct from memory.

        """
        input_creator = InputCreator(self.input_file, self.times, self.inputs)
        self.input_file = input_creator.default_creation_2().getvalue()

        return True

    def run_2(self):

        if self.debug:
            print("Output goes to:\n\tCOARSE:%s\n\tDETAIL:%s" % (self.output_coarse, self.output_detail))
        if self.suppress:
            # invoke the model program as a subprocess
            succ = subprocess.run([self.program,
                                   '-I',
                                   '-o', self.output_coarse,
                                   '-d', self.output_detail],
                                  input=self.input_file.encode(),
                                  stdout=self.DEVNULL,
                                  stderr=self.DEVNULL,
                                  timeout=self.timeout)
        else:
            stdoutname = os.path.join(
                self.workdir, '%s.stdout' % ("two_" + self.model_name))
            stderrname = os.path.join(
                self.workdir, '%s.stderr' % ("two_" + self.model_name))

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
                                   '-I',
                                   '-o', self.output_coarse,
                                   '-d', self.output_detail],
                                  input=self.input_file.encode(),
                                  stdout=f_out,
                                  stderr=f_err,
                                  timeout=self.timeout)

            if f_out:
                f_out.close()
            if f_err:
                f_err.close()

        return None


    def output_parse(self):
        """
        Function to parse the output files into a dictionary.
        """
        # Check if file is open

        file = open(self.output_coarse)


        for d in csv.DictReader(file, delimiter='\t'):
            for key,value in d.items():
                self.output_dict[key].append(float(value))



        return self.output_dict


