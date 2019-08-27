/*jshint esversion: 6 */
myApp.directive('fileReader', function () {
    return {
        scope: {
            fileReader: "=",
            parseResult: "="
        },
        link: function (scope, element) {
            scope.fileReader = {
                header: null,
                contents: []
            };

            var readFile = function (changeEvent) {
                var f = changeEvent.target.files;
                console.log(f)
                console.log("Uploaded ", f[0].type)

                if (f.length > 1) {
                    throw 'Uploaded more than one file'
                } else if (f.length < 1) {
                    throw "Did not upload a file."
                }
                // if (f[0].type !== 'text/csv') {
                //     throw 'Uploaded file must be a RFC4180-compliant CSV file';
                // }
                var r = new FileReader();
                r.onload = function (e) {
                    var contents = e.target.result;
                    scope.$apply(function () {
                        result = Papa.parse(contents, {
                            "skipEmptyLines": true
                        }).data;
                        console.table(result);
                        scope.parseResult = arrayToJSON(transposeArray(result));
                        scope.fileReader.header = result[0];
                        for (var i = 1; i < result.length; i++) {
                            scope.fileReader.contents.push(result[i]);
                        }
                    });
                };
                r.readAsText(f[0]);

            }
            try {
                $(element).on('change', readFile);
            } catch (error) {
                console.log(error);
            }

        }
    };
});

myApp.directive('peakSelect', function () {
    return {
        restrict: 'E',
        scope: {
            peakTypes: "=peakTypes",
            selectedPeak: "=ngModel"
        },
        require: 'ngModel',
        templateUrl: '/static/partials/peak-select.html',
        link: function (scope, element, attrs) { }
    };
});

myApp.directive('lineGraph', [function () {

    return {
        restrict: 'EA',
        scope: {
            data: "@",
            selectY: "@",
            selectX: "@"
        },
        link: function (scope, element, attrs) {
            //d3Service.d3().then(function(d3) {
            var keys = {
                "x": scope.selectX,
                "y": scope.selectY
            };
            var data = JSON.parse(scope.data);
            var dArray = [];
            for (var x in data) {
                data[x].forEach(function (element, idx) {
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


            // Watch for resize event
            scope.$watch(function () {
                return angular.element(window)[0].innerWidth;
            }, function () {

                scope.render(keys);
            });

            // Check for changes in bound data
            scope.$watch('selectX', function (newVal, oldVal) {
                keys.x = newVal;
                for (var x in keys) {
                    if (keys[x] == "") {
                        return;
                    }
                }
                return scope.render(keys);
            }, true);

            scope.$watch('selectY', function (newVal, oldVal) {
                keys.y = newVal;
                for (var x in keys) {
                    if (keys[x] == "") {
                        return;
                    }
                }
                return scope.render(keys);
            }, true);



            // Custom d3 code
            scope.render = function (keys) {
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
                let min_y = d3.min(data[keys.y])
                let max_y = d3.max(data[keys.y])
                let data_range = max_y - min_y
                // Set y data domain to be 5% larger than the data range.
                var y = d3.scaleLinear().range([height, 0]).domain([min_y - data_range * 0.025, max_y + data_range * 0.025]);

                // Define the axes
                var xAxis = d3.axisBottom().scale(x).ticks(5);

                var yAxis = d3.axisLeft().scale(y).ticks(5);


                // Define the line
                var valueline = d3.line()
                    .x(function (d) {
                        return x(d[keys.x]);
                    })
                    .y(function (d) {
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
                    .attr("stroke", "steelblue")
                    .attr("fill", "none")
                    .attr("stroke-width", "2px")
                    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");


                // Add the X Axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                    .call(xAxis)
                    .append("text");

                // Add the Y Axis
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(yAxis);

                // y-axis label
                svg.append("text")
                    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate(" + (margin.left / 3) + "," + (height / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
                    .text(keys.y);

                // x-axis label
                svg.append("text")
                    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate(" + (margin.left + width / 2) + "," + (height + margin.top + margin.bottom / 1.5) + ")") // text is drawn off the screen top left, move down and out and rotate
                    .text(keys.x);

            };
            //});
        }
    };
}]);

myApp.directive('steadyStateLineGraph', [function () {

    return {
        restrict: 'EA',
        scope: {
            data: "@",
            selectY: "@",
            selectX: "@",
            direction: "@"
        },
        link: function (scope, element, attrs) {
            //d3Service.d3().then(function(d3) {
            var keys = {
                "x": scope.selectX,
                "y": scope.selectY
            };
            var legendRectSize = 18;
            var legendSpacing = 4;
            var data = JSON.parse(scope.data);

            // Set color range
            var color = d3.scaleOrdinal(d3.schemeCategory10);

            var objectConversion = function (d) {
                var dArray = [];
                for (var x in d) {
                    d[x].forEach(function (element, idx) {
                        if (typeof dArray[idx] === "undefined") {
                            dArray[idx] = {};
                        }
                        dArray[idx][x] = element;
                    });
                }
                return dArray;
            };

            var dArray = objectConversion(data);


            // set the style of the the element to have a width of 100%
            var svg = d3.select(element[0])
                .append('svg')
                .style('width', '75%');


            // Browser onresize event
            window.onresize = function () {
                scope.$apply();
            };
            // Watch for resize event
            scope.$watch(function () {
                return angular.element(window)[0].innerWidth;
            }, function () {
                scope.render(keys);
            });
            // Check for changes in bound data
            scope.$watch('selectX', function (newVal, oldVal) {
                keys.x = newVal;
                for (var x in keys) {
                    if (keys[x] == "") {
                        return;
                    }
                }
                return scope.render(keys);
            }, true);

            scope.$watch('selectY', function (newVal, oldVal) {
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
            scope.render = function (keys) {
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
                    mainHeight = 270 - margin.top - margin.bottom;

                svg.attr("width", width + margin.left + margin.right)
                    .attr("height", mainHeight + margin.top + margin.bottom)
                    .attr("class", "chart");

                svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                // Add the BSline path.
                $.get("static/data/json/brainsignals-" + scope.direction + "-autoreg.json", function (in_data) {
                    var bsData = in_data[keys.x];
                    //var bsArray = [];
                    var x = d3.scaleLinear().range([0, width]);
                    var y = d3.scaleLinear().range([mainHeight, 0]);

                    x.domain([
                        d3.min([d3.min(data[input_enc[keys.x]]), d3.min(bsData[input_enc[keys.x]])]),
                        d3.max([d3.max(data[input_enc[keys.x]]), d3.max(bsData[input_enc[keys.x]])])
                    ]);

                    y.domain([
                        d3.min([d3.min(data[keys.y]), d3.min(bsData[keys.y])]),
                        d3.max([d3.max(data[keys.y]), d3.max(bsData[keys.y])]) * 1.025
                    ]);
                    // Define the axes
                    var xAxis = d3.axisBottom().scale(x).ticks(5);
                    var yAxis = d3.axisLeft().scale(y).ticks(5);
                    // Add the valueline function.

                    var valueline = d3.line()
                        .x(function (d) {
                            return x(d[input_enc[keys.x]]);
                        })
                        .y(function (d) {
                            return y(d[keys.y]);
                        });

                    var bsArray = objectConversion(bsData);

                    var dataset = [{
                        "label": 'Default BrainSignals',
                        "data": bsData,
                        "array": bsArray
                    },
                    {
                        "label": 'Model Run',
                        "data": data,
                        "array": dArray
                    }
                    ];

                    var path = svg.selectAll('path')
                        .data(dataset, function (d) { return d; })
                        .enter()
                        .append('path')
                        .attr("class", "line")
                        .attr("d", function (d, i) {
                            return valueline(d.array);
                        })
                        .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
                        .attr("fill", "none")
                        .attr("stroke-width", function (d) { return d.label === 'Default BrainSignals' ? '5px' : '2px'; })
                        .attr("stroke-dasharray", function (d) { return d.label === 'Default BrainSignals' ? '3' : ''; })
                        .attr("id", function (d) { return d.label === 'Default BrainSignals' ? 'bsPath' : ''; })
                        .attr('stroke', function (d, i) {
                            return color(d.label);
                        });


                    // Add the X Axis
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(" + margin.left + "," + (mainHeight + margin.top) + ")")
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

                    // y-axis label
                    svg.append("text")
                        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                        .attr("transform", "translate(" + (margin.left / 3) + "," + (mainHeight / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
                        .text("CBF");

                    // x-axis label
                    svg.append("text")
                        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                        .attr("transform", "translate(" + (margin.left + width / 2) + "," + (mainHeight + margin.top + margin.bottom / 1.5) + ")") // text is drawn off the screen top left, move down and out and rotate
                        .text(input_enc[keys.x]);

                    var legend = svg.selectAll('.legend') // NEW
                        .data(color.domain()) // NEW
                        .enter() // NEW
                        .append('g') // NEW
                        .attr('class', 'legend') // NEW
                        .attr("font-size", "12px")
                        .attr('transform', function (d, i) { // NEW
                            var height = legendRectSize + legendSpacing; // NEW
                            var offset = height * color.domain().length / 2; // NEW
                            var horz = width + margin.left // NEW
                            var vert = i * height - offset; // NEW
                            return 'translate(' + horz + ',' + (vert + mainHeight / 2) + ')'; // NEW
                        });

                    legend.append('rect') // NEW
                        .attr('width', legendRectSize) // NEW
                        .attr('height', legendRectSize) // NEW
                        .attr('stroke-width', '2')
                        .style('fill', color) // NEW
                        .style('stroke', color); // NEW

                    legend.append('text') // NEW
                        .attr('x', legendRectSize + legendSpacing) // NEW
                        .attr('y', legendRectSize - legendSpacing) // NEW
                        .text(function (d) {
                            return d;
                        });
                });


            };
            //});
            scope.render(scope.keys);
        }
    };
}]);
