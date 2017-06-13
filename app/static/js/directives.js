/*jshint esversion: 6 */
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
                if (f.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        scope.$apply(function() {
                            result = Papa.parse(contents, {
                                "skipEmptyLines": true
                            }).data;
                            scope.parseResult = arrayToJSON(transposeArray(result));
                            scope.fileReader.header = result[0];
                            for (var i = 1; i < result.length; i++) {
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

myApp.directive('peakSelect', function() {
    return {
        restrict: 'E',
        scope: {
            peakTypes: "=peakTypes",
            selectedPeak: "=ngModel"
        },
        require: 'ngModel',
        templateUrl: '/static/partials/peak-select.html',
        link: function(scope, element, attrs) {}
    };
});

myApp.directive('lineGraph', [function() {

    return {
        restrict: 'EA',
        scope: {
            data: "@",
            selectY: "@",
            selectX: "@"
        },
        link: function(scope, element, attrs) {
            //d3Service.d3().then(function(d3) {
            var keys = {
                "x": scope.selectX,
                "y": scope.selectY
            };
            var data = JSON.parse(scope.data);
            var dArray = [];
            for (var x in data) {
                data[x].forEach(function(element, idx) {
                    if (typeof dArray[idx] === "undefined") {
                        dArray[idx] = {};
                    }
                    dArray[idx][x] = element;
                });
            }

            // set the style of the the element to have a width of 100%
            var svg = d3.select(element[0])
                .append('svg')
                .style('width', '100%');


            // Browser onresize event
            window.onresize = function() {
                scope.$apply();
            };
            // Watch for resize event
            scope.$watch(function() {
                return angular.element(window)[0].innerWidth;
            }, function() {
                scope.render(scope.keys);
            });

            // Check for changes in bound data
            scope.$watch('selectX', function(newVal, oldVal) {
                keys.x = newVal;
                for (var x in keys) {
                    if (keys[x] == "") {
                        return;
                    }
                }
                return scope.render(keys);
            }, true);

            scope.$watch('selectY', function(newVal, oldVal) {
                keys.y = newVal;
                for (var x in keys) {
                    if (keys[x] == "") {
                        return;
                    }
                }
                return scope.render(keys);
            }, true);



            // Custom d3 code
            scope.render = function(keys) {
                // remove all previous items before render
                svg.selectAll('*').remove();

                // If we don't pass any data, return out of the element
                if (!keys || !data) return;
                // Set the dimensions of the canvas / graph
                var margin = {
                        top: 30,
                        right: 20,
                        bottom: 30,
                        left: 50
                    },
                    width = 600 - margin.left - margin.right,
                    height = 270 - margin.top - margin.bottom;

                svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("class", "chart");

                svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Set the ranges
                var x = d3.scaleLinear().range([0, width]).domain(d3.extent(data[keys.x]));
                var y = d3.scaleLinear().range([height, 0]).domain([d3.min(data[keys.y]), d3.max(data[keys.y]) * 1.025]);

                // Define the axes
                var xAxis = d3.axisBottom().scale(x).ticks(5);

                var yAxis = d3.axisLeft().scale(y).ticks(5);


                // Define the line
                var valueline = d3.line()
                    .x(function(d) {
                        return x(d[keys.x]);
                    })
                    .y(function(d) {
                        return y(d[keys.y]);
                    });
                // Scale the range of the data
                // x.domain(d3.extent(data[keys.x]));
                // y.domain([d3.min(data[keys.y]), d3.max(data[keys.y]) * 1.025]);

                // Add the valueline path.
                svg.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("id", "dataPath")
                    .attr("d", valueline(dArray))
                    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");


                // Add the X Axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                    .call(xAxis);

                // Add the Y Axis
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(yAxis);

            };
            //});
        }
    };
}]);

myApp.directive('steadyStateLineGraph', [function() {

    return {
        restrict: 'EA',
        scope: {
            data: "@",
            selectY: "@",
            selectX: "@",
            direction: "@"
        },
        link: function(scope, element, attrs) {
            //d3Service.d3().then(function(d3) {
            var keys = {
                "x": scope.selectX,
                "y": scope.selectY
            };
            var data = JSON.parse(scope.data);
            var dArray = [];
            for (var x in data) {
                data[x].forEach(function(element, idx) {
                    if (typeof dArray[idx] === "undefined") {
                        dArray[idx] = {};
                    }
                    dArray[idx][x] = element;
                });
            }


            // set the style of the the element to have a width of 100%
            var svg = d3.select(element[0])
                .append('svg')
                .style('width', '75%');


            // Browser onresize event
            window.onresize = function() {
                scope.$apply();
            };
            // Watch for resize event
            scope.$watch(function() {
                return angular.element(window)[0].innerWidth;
            }, function() {
                scope.render(scope.keys);
            });
            // Check for changes in bound data
            scope.$watch('selectX', function(newVal, oldVal) {
                keys.x = newVal;
                for (var x in keys) {
                    if (keys[x] == "") {
                        return;
                    }
                }
                return scope.render(keys);
            }, true);

            scope.$watch('selectY', function(newVal, oldVal) {
                keys.y = newVal;
                for (var x in keys) {
                    if (keys[x] == "") {
                        return;
                    }
                }
                return scope.render(keys);
            }, true);

            var input_enc = {
                sao2: 'SaO2sup',
                pa: "P_a",
                paco2: "Pa_CO2"
            };

            // Custom d3 code
            scope.render = function(keys) {
                // remove all previous items before render
                svg.selectAll('*').remove();

                // If we don't pass any data, return out of the element
                if (!keys || !data) return;
                // Set the dimensions of the canvas / graph
                var margin = {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 75
                    },
                    width = 600 - margin.left - margin.right,
                    height = 270 - margin.top - margin.bottom;

                svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("class", "chart");

                svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                // Add the BSline path.
                $.get("static/data/json/brainsignals-" + scope.direction + "-autoreg.json", function(in_data) {
                    var bsData = in_data[keys.x];
                    var bsArray = [];
                    var x = d3.scaleLinear().range([0, width]);
                    var y = d3.scaleLinear().range([height, 0]);
                    console.log(data);
                    console.log(bsData);
                    x.domain([
                        d3.min([d3.min(data[input_enc[keys.x]]), d3.min(bsData[input_enc[keys.x]])]),
                        d3.max([d3.max(data[input_enc[keys.x]]), d3.max(bsData[input_enc[keys.x]])])
                    ]);
                    console.log(d3.min([d3.min(data[keys.y]), d3.min(bsData[keys.y])]));
                    y.domain([
                        d3.min([d3.min(data[keys.y]), d3.min(bsData[keys.y])]),
                        d3.max([d3.max(data[keys.y]), d3.max(bsData[keys.y])]) * 1.025
                    ]);
                    // Define the axes
                    var xAxis = d3.axisBottom().scale(x).ticks(5);

                    var yAxis = d3.axisLeft().scale(y).ticks(5);
                    // Add the valueline path.

                    // Define the line
                    var valueline = d3.line()
                        .x(function(d) {
                            return x(d[input_enc[keys.x]]);
                        })
                        .y(function(d) {
                            return y(d[keys.y]);
                        });

                    console.log(dArray);
                    svg.append("path")
                        .data([data])
                        .attr("class", "line")
                        .attr("id", "dataPath")
                        .attr("d", valueline(dArray))
                        .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");

                    // Add the X Axis
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("x", 6)
                        .attr("dx", ".71em")
                        .style("text-anchor", "end")
                        .text(input_enc[keys.x]);

                    // Add the Y Axis
                    svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                        .call(yAxis);

                    for (var i in bsData) {
                        bsData[i].forEach(function(element, idx) {
                            if (typeof bsArray[idx] === "undefined") {
                                bsArray[idx] = {};
                            }
                            bsArray[idx][i] = element;
                        });
                    }
                    svg.append("path")
                        .data([bsData])
                        .attr("class", "line")
                        .attr("id", "bsPath")
                        .attr("d", valueline(bsArray))
                        .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");

                    // y-axis label
                    svg.append("text")
                        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                        .attr("transform", "translate(" + (margin.left / 3) + "," + (height / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
                        .text("CBF");

                    // x-axis label
                    svg.append("text")
                        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                        .attr("transform", "translate(" + (margin.left + width/2) + "," + (height + margin.top + margin.bottom / 1.5) + ")") // text is drawn off the screen top left, move down and out and rotate
                        .text(input_enc[keys.x]);
                });


            };
            //});
            scope.render(scope.keys);
        }
    };
}]);
