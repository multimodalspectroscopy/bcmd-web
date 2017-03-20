myApp.directive('fileReader', function() {
    return {
        scope: {
            content: '=?',
            header: '=?',
            fileReader: "="
        },
        link: function(scope, element) {
            $(element).on('change', function(changeEvent) {
                var files = changeEvent.target.files;
                console.log(files);
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        scope.$apply(function() {
                          var content = {
                            csv: e.target.result.replace(/\r\n|\r/g,'\n'),
                            header: scope.header,
                            separator: scope.separator
                          };
                          scope.content = content.csv;
                          scope.result = csvtoJSON(content);
                          scope.result.filename = scope.filename;
                          scope.$$postDigest(function(){
                            if (typeof scope.callback === 'function'){
                              scope.callback(onChangeEvent);
                            }
                          });
                            scope.fileReader = contents;
                        });
                    };
                    r.readAsText(files[0]);
                }
            });

            var csvToJSON = function(content) {
                var lines = content.csv.split(new RegExp('\n(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
                var result = [];
                var start = 0;
                var columnCount = lines[0].split(content.separator).length;

                var headers = [];
                if (content.header) {
                    headers = lines[0].split(content.separator);
                    start = 1;
                }

                for (var i = start; i < lines.length; i++) {
                    var obj = {};
                    var currentline = lines[i].split(new RegExp(content.separator + '(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
                    if (currentline.length === columnCount) {
                        if (content.header) {
                            for (var j = 0; j < headers.length; j++) {
                                obj[headers[j]] = cleanCsvValue(currentline[j]);
                            }
                        } else {
                            for (var k = 0; k < currentline.length; k++) {
                                obj[k] = cleanCsvValue(currentline[k]);
                            }
                        }
                        result.push(obj);
                    }
                }
                return result;
            };

            var cleanCsvValue = function(value) {
                return value
                    .replace(/^\s*|\s*$/g, "") // remove leading & trailing space
                    .replace(/^"|"$/g, "") // remove " on the beginning and end
                    .replace(/""/g, '"'); // replace "" with "
            };
        }
    };
});
