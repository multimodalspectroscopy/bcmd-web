import os
from flask import Flask, render_template
from flask_pymongo import PyMongo
from flask_restful import Api
app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
# print("Environment is {}".format(os.environ['APP_SETTINGS']))

mongo = PyMongo(app)

# Local module import
from app.gui.api import ModelInfo, api
from app.gui.controllers import choose_model

api.add_resource(ModelInfo, '/ModelInfo')
# Get array of available models.


def get_choices():
    guidir = os.path.abspath(os.path.dirname(__file__))
    build_dir = os.path.abspath(os.path.join(os.path.dirname(guidir),
                                             'build'))
    assert os.path.basename(build_dir) == 'build', "Incorrect base directory"
    model_choices = [os.path.splitext(file)[0] for file in os.listdir(
        build_dir) if file.endswith('.model')]

    return {'available_model':model_choices}

available_models = get_choices()
# Register blueprint(s)
# app.register_blueprint(choose_model)

# Sample HTTP error handling


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.route('/')
def index():
    return render_template("gui/index.html", available_models=available_models)