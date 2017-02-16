# Import database object from main app module
from app import mongo

from app import app

# Import modelJSON module functions
import app.BayesCMD.jsonParsing as jsonParsing

from bson.json_util import dumps


class MongoInfoPull:
    def __init__(self, model_json):
        self.model_json = model_json

    def add_model_info(self):
        with app.app_context():
            if mongo.db.models.find(model_json).count() > 0:
                return 'Model already exists'
            else:
                fpath = jsonParsing.getDefaultFilePath(model_json['model_name'])
                mongo.db.models.insert(jsonParsing.modeldefParse(fpath))
                return 'Added Model Data'

    def get_model_info(self):
        with app.app_context():
            model_info = mongo.db.models.find_one(model_json)
        return model_info
