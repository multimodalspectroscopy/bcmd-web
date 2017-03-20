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

myApp.controller('RunModelController', ['$scope', '$http', 'Upload', function($scope, $http, Upload){
  $scope.submit=function(){
    if ($scope.form.file.$valid && $scope.file){
      $scope.upload($scope.file);
    }
  };

  //upload on file select

  $scope.upload = function(file){
    Upload.upload({
      url: '/data/csv',
      data: {file: file}
    }).then(function(resp) {
      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function(resp) {
      console.log('Error status: ' + resp.status);
    }, function(evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded /evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };
}]);
