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
                console.log(f[0]);
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
        restruct: 'E',
        scope: {
            peakTypes: "=peakTypes"
        },
        templateUrl: '/static/partials/peak-select.html'
    }
});

myApp.directive('lineGraph', ['d3Service', function(d3Service) {

    // constants
    var margin = 20,
        width = 960,
        height = 500 - 0.5 - margin,
        color = d3.interpolateRgb("#f77", "#77f");
    return {
        restrict: 'EA',
        scope: {
            data: '=' // bi-directional data-binding
        },
        link: function(scope, element, attrs) {
            d3Service.d3().then(function(d3) {


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
                    scope.render(scope.data);
                });

                // Check for changes in bound data
                scope.$watch('data', function(newVals, oldVals) {
                    return scope.render(newVals);
                }, true);

                // Custom d3 code
                console.log(svg);
                
                scope.render = function(data) {
                    console.log(svg);
                    // remove all previous items before render
                    svg.selectAll('*').remove();

                    // If we don't pass any data, return out of the element
                    if (!data) return;
                    // Set the dimensions of the canvas / graph
                    var margin = {
                            top: 30,
                            right: 20,
                            bottom: 30,
                            left: 50
                        },
                        width = 600 - margin.left - margin.right,
                        height = 270 - margin.top - margin.bottom;

                    // Set the ranges
                    var x = d3.time.scale().range([0, width]);
                    var y = d3.scale.linear().range([height, 0]);

                    // Define the axes
                    var xAxis = d3.svg.axis().scale(x)
                        .orient("bottom").ticks(5);

                    var yAxis = d3.svg.axis().scale(y)
                        .orient("left").ticks(5);

                    // Define the line
                    var valueline = d3.svg.line()
                        .x(function(d, key) {
                            return x(d.t);
                        })
                        .y(function(d, key) {
                            if (key !== "t") {
                                return y(d[key]);
                            }
                        });

                    // Adds the svg canvas
                    svg = d3.select("body")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

                    // Get min and max from all data
                    var max_y = 0,
                        min_y = 0;

                    for (let key of Object.keys(data)) {
                        max_y = Math.max(max_y, d3.max(data, function(d) {
                            return d.close;
                        }));

                        min_y = Math.min(min_y, d3.max(data, function(d) {
                            return d.close;
                        }));
                    }
                    // Scale the range of the data
                    x.domain(d3.extent(data, function(d) {
                        return d.t;
                    }));
                    y.domain([min_y, max_y]);

                    // Add the valueline path.
                    for (let key of Object.keys(data)) {
                        svg.append("path")
                            .attr("class", "line")
                            .attr("d", valueline(data, key));
                    }

                    // Add the X Axis
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    // Add the Y Axis
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);
                }
            });
        }
    };
}]);
