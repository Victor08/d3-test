


var data = {
    options: {
        color: 'blue',
        lineStyle: ''
    },
    data: {
        x: [1,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180],
        y: [54,98,35,64,2,84,98,64,3,8,98,78,235,234,234,54]
    }
};

InitChart(data);

function InitChart(data) {

    var lineData = buildDataObject(data.data);
    var color = data.options.color;
    var lineStyle = data.options.lineStyle;
    var chartElement = document.getElementById("chart");
    var chartDimensions = getChartDimensions(chartElement);
    setChartElementStyles(chartElement, chartDimensions);

    console.log('line data', chartDimensions);

    var vis = d3.select("#chart"),
        WIDTH = chartDimensions.width,
        HEIGHT = chartDimensions.height,
        MARGINS = {
            top: chartDimensions.top,
            right: chartDimensions.right,
            bottom: chartDimensions.bottom,
            left: chartDimensions.left
        },
        xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
            return d.x;
        }),
            d3.max(lineData, function (d) {
                return d.x;
            })
        ]),

        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
            return d.y;
        }),
            d3.max(lineData, function (d) {
                return d.y;
            })
        ]),

        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true),

        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient("left")
            .tickSubdivide(true);

    console.log('margins', MARGINS);

    vis.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

    vis.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    var lineFunc = d3.svg.line()
        .x(function (d) {
            return xRange(d.x);
        })
        .y(function (d) {
            return yRange(d.y);
        })
        .interpolate('linear');

    vis.append("svg:path")
        .attr("d", lineFunc(lineData))
        .attr("stroke-dasharray", (3,3))
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("fill", "none");
}

function buildDataObject (data) {
    var result = [];
    if ((data.x.length !== data.y.length) && data.x.length > data.y.length) {
        data.x = data.x.slice(0, data.y.length);
    } else {
        data.y = data.y.slice(0, data.x.length);
    }
    for (var i = 0; i < data.x.length; i++) {
        result.push({x: data.x[i], y: data.y[i]});
    }
    return result;
}

function getChartDimensions (chartElement) {
    var parentWidth = chartElement.parentElement.clientWidth;
    //var parentHeight = chartElement.parentElement.clientHeight;
    var width = parseInt(parentWidth * 1);
    var height = 500;
    var marginX = parseInt((parentWidth - width) / 2);
    var marginY = 30;
    return {width: width, height: height, left: marginX, right: marginX, top: marginY, bottom: marginY};
}
function setChartElementStyles (chartElement, chartDimensions) {
    chartElement.setAttribute('style', 'width:100%;height:' + chartDimensions.height);
    chartElement.style.width = '100%';
    chartElement.style.height = chartDimensions.height;
}