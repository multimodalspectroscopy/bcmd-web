# Import database object from main app module
from app import mongo

from app import app

# Import modelJSON module functions
import app.BayesCMD.jsonParsing as jsonParsing

from flask import jsonify

class ModelInfo:
    def __init__(self, modelname):
        self.modelname = modelname

    def add_model_info(self):
        with app.app_context():
            if mongo.db.models.find({"model_name": self.modelname}).count() > 0:
                return 'Model already exists'
            else:
                fpath = jsonParsing.getDefaultFilePath(self.modelname)
                mongo.db.models.insert(jsonParsing.modeldefParse(fpath))
                return 'Added Model Data'

    def get_model_info(self):
        with app.app_context():
            model_info = mongo.db.models.find({"model_name": self.modelname})
        return jsonify(model_info)