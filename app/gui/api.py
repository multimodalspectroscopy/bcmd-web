from flask_restful import Api, Resource
from flask_restful import reqparse
from flask import jsonify, json
import sys

from bayescmd.bcmdModel import signalGenerator, ModelBCMD

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

    @staticmethod
    def request_handler(request):
        # Convert from JSON string to dict using flask.json.loads
        request = json.loads(request)
        parsedReq = {}
        parsedReq['start'] = request["startTime"]
        parsedReq['end'] = request["endTime"]
        parsedReq['sample_rate'] = request["sampleRate"]
        parsedReq['peaks'] = []
        for peak in request['peaks']:
            length = float(peak['end']) - float(peak['start'])
            i = 1
            parsedReq['peaks'].append(
                (float(peak['start']),
                 float(peak['end']),
                 float(peak['height']),
                 peak['type']))
            if 'nRepeats' in peak.keys():
                while (i < int(peak['nRepeats']) and
                       parsedReq['peaks'][i - 1][1] +
                       float(peak['interval']) < request["endTime"]):
                    newStart = parsedReq['peaks'][
                        i - 1][1] + float(peak['interval'])
                    newEnd = newStart + length
                    parsedReq['peaks'].append((newStart,
                                               newEnd,
                                               float(peak['height']),
                                               peak['type']))
                    i += 1
        return parsedReq

    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('demand_dict',
                                help="Dictionary of demand information.")
            args = parser.parse_args()

            with app.app_context():
                response = {"demand_signal": []}
                parsedReq = self.request_handler(args['demand_dict'])
                response["demand_signal"] = signalGenerator(
                    **parsedReq).tolist()
                print(response["demand_signal"], file=sys.stderr)
            return jsonify(response)

        except Exception as e:
            return {"error": str(e)}, 404


class RunModel(Resource):

    @staticmethod
    def request_handler(modelName, inputs, times, params, outputs, burn_in):

        timed_model = ModelBCMD(request['modelName'],
                                inputs=inputs,
                                params=params,
                                times=times,
                                outputs=outputs,
                                burn_in=burn_in,
                                debug=False)

        return time_model

    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('burnIn',
                                help="Model burn in period")
            parser.add_argument('inputs',
                                help="Model inputs")
            parser.add_argument('modelName',
                                help="Name of model",
                                required=True)
            parser.add_argument('params',
                                help="Non-default model parameters")
            parser.add_argument('times',
                                help="Time points for simulation",
                                action='append',
                                required=True)
            parser.add_argument('outputs',
                                help="Model outputs")
            parser.add_argument('runData')
            args = parser.parse_args()

            with app.app_context():
                response = {}
                model = self.request_handler(args['modelName'],
                                                 args['inputs'],
                                                 args['times'],
                                                 args['params'],
                                                 args['outputs'],
                                                 args['burnIn'])
                print(model)

        except Exception as e:
            print(e, file=sys.stderr)
            return {"error": str(e)}, 404
