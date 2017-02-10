import os
from flask import Flask, render_template
from flask_pymongo import PyMongo


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
#print("Environment is {}".format(os.environ['APP_SETTINGS']))

mongo = PyMongo(app)

# Import method to get possible models.
from app.gui.controllers import get_choices

# Populate database with all model information documents.
from app.gui.models import ModelInfo

for model in get_choices():
    ModelInfo(model[0]).add_model_info()

# Import a module/component using its blueprint handler variable
from app.gui.controllers import choose_model

# Register blueprint(s)
app.register_blueprint(choose_model)

# Sample HTTP error handling
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.route('/')
def splash():
    return render_template("gui/splash.html")
