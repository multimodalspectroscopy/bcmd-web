

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


def test_default_output_2():
    """
    Check that a full model run will create the correct input file and output data. Uses StringIO as model input.
    """
    #input_file = os.path.join('.', 'test_files', 'test.input')
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
    params=None

    default_model_2 = ModelBCMD('rc',
                                inputs,
                                params,
                                times,
                                input_file = None,
                                input_required=True,
                                testing=True,
                                workdir=os.path.join('.','test_files'),
                                debug=True,
                                basedir=BASEDIR)

    default_model_2.write_default_input_2()
    print(default_model_2.input_file.encode())
    print(default_model_2.input_file.encode().decode())
    default_model_2.run_2()
    assert_true(filecmp.cmp(default_model_2.output_coarse, actual), msg='Coarse output files do not match actual.')
    os.remove(default_model_2.output_coarse)
    os.remove(default_model_2.output_detail)

def write_default_input_2(self):
    """
    Method to write input file to string buffer for access direct from memory.

    """
    input_creator = InputCreator(self.input_file, self.times, self.inputs)
    self.input_file = input_creator.default_creation_2().getvalue()

    return True

def run_2(self):

    if self.debug:
        print("Output goes to:\n\tCOARSE:%s\n\tDETAIL:%s"%(self.output_coarse,self.output_detail))
    if self.suppress:
        # invoke the model program as a subprocess
        succ = subprocess.run([self.program,
                               '-o', self.output_coarse,
                               '-d', self.output_detail],
                              input=self.input_file.encode(),
                              stdout=self.DEVNULL,
                              stderr=self.DEVNULL,
                              timeout=self.timeout)
    else:
        stdoutname = os.path.join(
            self.workdir, '%s.stdout' % ("two_"+self.model_name))
        stderrname = os.path.join(
            self.workdir, '%s.stderr' % ("two_"+self.model_name))

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
                               '-o', self.output_coarse,
                               '-d', self.output_detail],
                              input = self.input_file.encode(),
                              stdout=f_out,
                              stderr=f_err,
                              timeout=self.timeout)

        if f_out:
            f_out.close()
        if f_err:
            f_err.close()

    return None