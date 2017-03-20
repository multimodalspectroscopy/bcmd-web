myApp.controller('DisplayModelsController',['$scope','$http',

    function($scope, $http) {

    $scope.data = {
        choice: null,
        models: available_models.models
    };

    $scope.submit = function() {
        var name = $scope.data.choice.model;
        console.log("Name is " + name);
        $http.get('/api/modelinfo', {
            "params": {
                "model_name": name
            }
        }).then(function(response) {
            $scope.infoCategories = [{
                    "name": "Inputs",
                    "data": response.data.input
                },
                {
                    "name": "Outputs",
                    "data": response.data.output
                },
                {
                    "name": "Parameters",
                    "data": response.data.params
                }
            ];
        });

    };
}]);


myApp.controller('IndexController',['$scope','$http',function($scope, $http) {

}]);

myApp.controller('RunModelController', ['$scope', '$http', '$parse', function($scope, $http, $parse){
  $scope.csv = {
    content: null,
    header: true,
    headerVisible: true,
    separator: ',',
    separatorVisible: true,
    result: null,
    encoding: 'UTF-8',
    uploadButtonLabel: "Upload CSV"
  };

  var _lastGoodResult = '';
  $scope.toPrettyJSON = function(json, tabWidth){
    var objStr = JSON.stringify(json);
    var obj = null;
    try{
      obj=$parse(objStr)({});
    } catch(e){
      return _lastGoodResult;
    }

    var result = JSON.stringify(obj, null, Number(tabWidth));
    _lastGoodResult = result;
  };
}]);
