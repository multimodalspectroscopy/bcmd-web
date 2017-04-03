import sys
import os
try:
    import bayescmd
except ImportError:
    sys.path.append(os.path.relpath(
        os.path.dirname(os.path.dirname(__file__))))
