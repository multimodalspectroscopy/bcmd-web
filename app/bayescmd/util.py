import os
import sys


def findBaseDir(max_depth=5, verbose=False):
    MAX_DEPTH = max_depth
    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    for level in range(MAX_DEPTH):
        if verbose:
            print('LEVEL %d: %s' % (level, BASEDIR))
        if os.path.basename(BASEDIR) == 'BayesCMD':
            break
        else:
            BASEDIR = os.path.abspath(os.path.dirname(BASEDIR))
        if level == MAX_DEPTH-1:
            print('Could not find correct basedir')
            sys.exit(status=2)
    return os.path.relpath(BASEDIR)
