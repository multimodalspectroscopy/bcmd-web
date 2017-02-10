# Import database object from main app module
from app import mongo

# Import modelJSON module functions
import app.BayesCMD.jsonParsing as jsonParsing

from flask import jsonify

class ModelInfo:
    models = mongo.db.models
    def __init__(self, modelname):
        self.modelname = modelname

    def add_model_info(self, db):
        fpath = jsonParsing.getDefaultFilePath(self.modelname)
        ModelInfo.models.insert(jsonParsing.modeldefParse(fpath))
        return 'Added Model Data'

    def get_model_info(self):
        model_info = ModelInfo.models.find_one({"model_name": self.modelname})
        return jsonify(model_info)