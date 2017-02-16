# Import Flask dependencies
from flask import request, render_template, Blueprint, redirect, url_for

# Import database object from main app module
from app import mongo

# Import module forms
from app.gui.forms import ModelForm
from app.gui.api import ModelInfo

import os


def get_choices():
    guidir = os.path.abspath(os.path.dirname(__file__))
    build_dir = os.path.abspath(os.path.join(os.path.dirname(guidir),
                                'build'))
    model_choices=[(os.path.splitext(file)[0], os.path.splitext(file)[0])
                     for file in os.listdir(build_dir) if file.endswith('.model')]

    return model_choices

choose_model = Blueprint('choose_model', __name__)


@choose_model.route('/choose_model', methods=['GET', 'POST'])
def get_model_choices():
    form = ModelForm(request.form)
    form.model_name.choices = get_choices()
    if request.method == 'POST' and form.validate():
        model = ModelInfo(form.model_name.data)
        model_info = model.get()
    else:
        model_info = None
    return render_template("gui/choose-model.html",
                           form = form,
                           model_choices = get_choices(),
                           model_info = model_info)
