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

myApp.controller('RunModelController', ['$scope', '$http', function($scope, $http){
  $scope.csv = {
    content: null,
    header: true,
    headerVisible: true,
    separator: ',',
    separatorVisible: true,
    result: null,
    encoding: 'ISO-8859-1',
    mdSvgIcon: '/static/icons/ic_backup_black_24px.svg',
    uploadButtonLabel: "upload a csv file"
  };
  console.log($scope.csv);
}]);
