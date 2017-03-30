from flask_restful import Api, Resource
from flask_restful import reqparse
from flask import jsonify

from bayescmd.bcmdModel import signalGenerator

from app import app

from app import mongo

api = Api(app)


class ModelInfo(Resource):

    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('model_name',
                                type=str,
                                help="Name of the model to POST to database.",
                                required=True)
            args = parser.parse_args()

            _modelName = args['model_name']

            model_json = {"model_name": _modelName}

            with app.app_context():
                if mongo.db.models.find(model_json).count() > 0:
                    return {"status": 100, "message": "Model already exists"}
                else:
                    fpath = jsonParsing.getDefaultFilePath(
                        model_json['model_name'])
                    mongo.db.models.insert(jsonParsing.modeldefParse(fpath))
                    return {"status": 200, "message": "Added Model Data"}

        except Exception as e:
            return {"error": str(e)}

    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('model_name',
                                type=str,
                                help="Name of the model to GET from database.")
            args = parser.parse_args()

            _modelName = args['model_name']
            with app.app_context():
                model_info = mongo.db.models.find_one(
                    {"model_name": _modelName})
                model_info.pop("_id")
            return jsonify(model_info)
        except Exception as e:
            return {"error": str(e)}


class DemandCreator(Resource):
    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('demand_dict',
                                type=str,
                                help="Dictionary of demand information.")
            args = parser.parse_args()

            with app.app_context():
                demand_info = signalGenerator(**args)
                print(demand_info)
            return jsonify(demand_info)

        except Exception as e:
            return {"error": str(e)}, 404
