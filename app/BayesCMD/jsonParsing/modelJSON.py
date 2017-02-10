import json
import os.path
import re
import pprint
import subprocess
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ..bcmdModel.bcmd_model import ModelBCMD
from io import StringIO

BASEDIR='../../..'

def float_or_str(n):
    try:
        s = float(n)
        return s
    except ValueError:
        return n


def get_model_name(fpath):
    fname = os.path.split(fpath)[-1]
    return fname.split('.')[0]


def json_writer(model_name, dictionary):
    with open('%s.json' % model_name, 'w') as fp:
        json.dump(dictionary, fp)


def modeldefParse(fpath):
    model_data = {'params': {}}

    with open(fpath) as f:
        model_data['model_name'] = get_model_name(fpath)
        for line in filter(None, (line.rstrip() for line in f)):
            li = line.lstrip()
            li = li.split()
            if li[0][:1] == '@':
                model_data.setdefault(li[0][1:],
                                      []).extend([item for item in li[1:]])
    model = ModelBCMD(model_data['model_name'])
    result = StringIO(model.get_defaults().stdout.decode())
    model_data['params'].update({line.strip('\n').split('\t')[0]:
                                 line.strip('\n').split('\t')[1]
                                 for line in result})
    json_writer(model_data['model_name'], model_data)

    return model_data


def getDefaultFilePath(model_name):
    return os.path.join(BASEDIR,'examples',model_name+'.modeldef')

if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser(description='Process some integers.')
    ap.add_argument('model_file', metavar='FILE', help='the modeldef file')
    args = ap.parse_args()
    pprint.pprint(modeldefParse(args.model_file), depth=2)
