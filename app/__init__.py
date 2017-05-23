import os
from flask import Flask, render_template
from flask_pymongo import PyMongo
from flask_restful import Api
from flask_basicauth import BasicAuth
app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
# print("Environment is {}".format(os.environ['APP_SETTINGS']))

mongo = PyMongo(app)

# Local module import
from app.gui.api import ModelInfo, DemandCreator, RunModel, RunDefault, api, CompileModel, AvailableModels, AvailableModelDefs

# Get array of available models.


def get_choices():
    guidir = os.path.abspath(os.path.dirname(__file__))
    build_dir = os.path.abspath(os.path.join(os.path.dirname(guidir),
                                             'build'))
    assert os.path.basename(build_dir) == 'build', "Incorrect base directory"
    model_choices = [{"id": idx, "model": os.path.splitext(file)[0]}
                     for idx, file in enumerate(os.listdir(build_dir))
                     if file.endswith('.model')]

    return {"models": model_choices, "count": len(model_choices)}


def get_defs():
    guidir = os.path.abspath(os.path.dirname(__file__))
    examples_dir = os.path.abspath(os.path.join(os.path.dirname(guidir),
                                                'examples'))
    assert os.path.basename(examples_dir) == 'examples', "Incorrect directory"
    model_choices = [{"id": idx, "model": os.path.splitext(file)[0]}
                     for idx, file in enumerate(os.listdir(examples_dir))
                     if file.endswith('.modeldef')]

    return {"models": model_choices, "count": len(model_choices)}




# Add API route for getting models.
api.add_resource(AvailableModels, '/api/getmodels')
api.add_resource(AvailableModelDefs, '/api/getmodeldefs')
api.add_resource(ModelInfo, '/api/modelinfo')
api.add_resource(DemandCreator, '/api/demandcreation')
api.add_resource(RunModel, '/api/runmodel')
api.add_resource(RunDefault, '/api/rundefault')
api.add_resource(CompileModel, '/api/compilemodel')
# Sample HTTP error handling


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


# Admin Section
basic_auth = BasicAuth(app)


@app.route('/admin')
@basic_auth.required
def admin():
    return render_template('admin.html')


@app.route('/')
def index():
    return render_template("index.html")
