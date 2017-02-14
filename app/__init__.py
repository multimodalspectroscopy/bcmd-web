import os
from flask import Flask, render_template
from flask_pymongo import PyMongo
from flask_restful import Api

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
#print("Environment is {}".format(os.environ['APP_SETTINGS']))

mongo = PyMongo(app)

# Local module import
from app.gui.controllers import choose_model
from app.gui.api import ModelInfo, api
from app.gui.controllers import get_choices


api.add_resource(ModelInfo, '/ModelInfo')
# Populate database with available models.

# Register blueprint(s)
# app.register_blueprint(choose_model)

# Sample HTTP error handling


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.route('/')
def index():
    return render_template("gui/index.html")
