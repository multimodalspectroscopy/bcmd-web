import os
import sys


def findBaseDir(basename, max_depth=5, verbose=True):
    """
    Get relative path to a BASEDIR.
    :param basename: Name of the basedir to path to
    :type basename: str

    :return: Relative path to base directory.
    :rtype: StringIO
    """
    MAX_DEPTH = max_depth
    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    print("STARTING AT: %s\n Looking for: %s" % (BASEDIR, basename))
    for level in range(MAX_DEPTH):
        if verbose:
            print('LEVEL %d: %s' % (level, BASEDIR))
        if os.path.basename(BASEDIR) == basename:
            break
        else:
            BASEDIR = os.path.abspath(os.path.dirname(BASEDIR))
        if level == MAX_DEPTH-1:
            sys.exit('Could not find correct basedir\n Currently at %s' % BASEDIR)
    return os.path.relpath(BASEDIR)
