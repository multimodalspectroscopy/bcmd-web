import os.path
from flask import request
# Import Form
from flask_wtf import Form

# Import Form elements such as TextField and BooleanField (optional)
from wtforms import SelectField

# Import Form validators
from wtforms.validators import DataRequired


# Define the login form (WTForms)

class ModelForm(Form):
    model_name = SelectField('BCMD Model Name')
