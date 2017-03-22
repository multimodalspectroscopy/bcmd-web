myApp.directive('fileReader', function() {
    return {
        scope: {
            fileReader: "=",
            parseResult: "="
        },
        link: function(scope, element) {
            scope.fileReader = {
                header: null,
                contents: []
            };
            $(element).on('change', function(changeEvent) {
                var f = changeEvent.target.files;
                console.log(f[0]);
                if (f.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        scope.$apply(function() {
                            result = Papa.parse(contents).data;
                            scope.parseResult = arrayToJSON(transposeArray(result));
                            scope.fileReader.header = result[0];
                            for (var  i = 1; i<result.length; i++){
                              scope.fileReader.contents.push(result[i]);
                            }
                        });
                    };
                    r.readAsText(f[0]);
                }
            });
        }
    };
});
