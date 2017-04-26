import os
from flask import Flask, render_template
from flask_pymongo import PyMongo
from flask_restful import Api
app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
# print("Environment is {}".format(os.environ['APP_SETTINGS']))

mongo = PyMongo(app)

# Local module import
from app.gui.api import ModelInfo, DemandCreator, RunModel, RunDefault, api


# Get array of available models.
def get_choices():
    guidir = os.path.abspath(os.path.dirname(__file__))
    build_dir = os.path.abspath(os.path.join(os.path.dirname(guidir),
                                             'build'))
    assert os.path.basename(build_dir) == 'build', "Incorrect base directory"
    model_choices = [{"id": idx, "model": os.path.splitext(file)[0]}
                     for idx, file in enumerate(os.listdir(build_dir))
                     if file.endswith('.model')]

    return {'models': model_choices, "count": len(model_choices)}


available_models = get_choices()

# Add API route for getting models.
api.add_resource(ModelInfo, '/api/modelinfo')
api.add_resource(DemandCreator, '/api/demandcreation')
api.add_resource(RunModel, '/api/runmodel')
api.add_resource(RunDefault, '/api/rundefault')

# Sample HTTP error handling


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.route('/')
def index():
    return render_template("index.html", available_models=available_models)
