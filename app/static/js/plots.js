/*jshint esversion: 6 */
var plotCSV = function(data) {
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
    var svg = d3.select("body")
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

};
