"use strict";
(function(){

    // mock data
    var data = {
        title: 'test chart',
        xLabel: 'some x label',
        yLabel: 'some y label',
        lines: [
            {
                color: 'blue',
                lineStyle: 'dashed',
                x: [1,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180],
                y: [54,98,35,64,2,84,98,64,3,8,98,78,235,234,234,54,234,24,24,24,12,13]
            },
            {
                color: 'red',
                lineStyle: '',
                x: [1,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180],
                y: [23,54,12,56,76,87,45,56,87,97,56,34,2,23,45,64,67,56,85,6,5,44]
            }

        ]

    };

    drawSvgChart(data);
    handleResize();



    function drawSvgChart(data) {

        var chartElement = document.getElementById("chart");
        var chartDimensions = getChartDimensions(chartElement);
        setChartElementStyles(chartElement, chartDimensions);

        for (var line in data.lines) {
            data.lines[line].dataSet = buildDataObject(data.lines[line]);
        }

        var chartSvg = d3.select("#chart"),
            width = chartDimensions.width,
            height = chartDimensions.height,
            margins = {
                top: chartDimensions.top,
                right: chartDimensions.right,
                bottom: chartDimensions.bottom,
                left: chartDimensions.left
            },
            rangeValues = getRangeValues(data.lines),
            xRange = d3.scale.linear().range([margins.left, width + margins.left]).domain([rangeValues.xMin, rangeValues.xMax]),

            yRange = d3.scale.linear().range([height - margins.top, margins.bottom]).domain([rangeValues.yMin, rangeValues.yMax]),

            xAxis = d3.svg.axis()
                .scale(xRange)
                .tickSize(5)
                .tickSubdivide(true),

            yAxis = d3.svg.axis()
                .scale(yRange)
                .tickSize(5)
                .orient("left")
                .tickSubdivide(true);

        chartSvg.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - margins.bottom) + ")")
            .call(xAxis);

        chartSvg.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (margins.left) + ",0)")
            .call(yAxis);

        var lineFunc = d3.svg.line()
            .x(function (d) {
                return xRange(d.x);
            })
            .y(function (d) {
                return yRange(d.y);
            })
            .interpolate('linear');

        for (var line in data.lines) {
            var path = chartSvg.append("svg:path")
                .attr("d", lineFunc(data.lines[line].dataSet))
                .attr("stroke", data.lines[line].color)
                .attr("stroke-width", 2)
                .attr("fill", "none");
            if (data.lines[line].lineStyle === 'dashed') {
                path.style("stroke-dasharray", ("5,2"));
            }
        }

        if (data.title && typeof data.title === 'string') {
            chartSvg.append("text")
                .classed('data', true)
                .attr("x", function() { return (width + margins.left * 2) / 2; })
                .attr("y", "40")
                .attr("fill","#000")
                .style("stroke-width", 1)
                .style({"font-size":"30px","z-index":"999999999"})
                .attr("text-anchor", "middle")
                .text(data.title);
        }
        if (data.xLabel && typeof data.xLabel === 'string') {
            chartSvg.append("text")
                .classed('data', true)
                .attr("x", width + margins.left)
                .attr("y", height - ( margins.top * .6 ))
                .attr("fill","#000")
                .style("stroke-width", 1)
                .style({"font-size":"20px","z-index":"999999999"})
                .attr("text-anchor", "end")
                .text(data.xLabel);
        }
        if (data.yLabel && typeof data.yLabel === 'string') {
            chartSvg.append("text")
                .classed('data', true)
                .attr('id', 'svgChartYLabel')
                .attr("x", - margins.top)
                .attr("y", margins.left * .6)
                .attr("fill","#000")
                .attr("transform", "rotate(-90)")
                .style("stroke-width", 1)
                .style({"font-size":"20px","z-index":"999999999"})
                .attr("text-anchor", "end")
                .text(data.yLabel);
        }

        arrangeLabels();

    }

    /**
     * builds data structure to use with d3 to draw path
     * @param data
     * @returns {Array}
     */
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

    /**
     * returns actual chart area size and position relative to svg element
     * @param chartElement
     * @returns {{width: Number, height: number, left: Number, right: Number, top: number, bottom: number}}
     */
    function getChartDimensions (chartElement) {
        var parentWidth = chartElement.parentElement.clientWidth;
        var width = parseInt(parentWidth * 0.8);
        var height = 500;
        var marginX = parseInt((parentWidth - width) / 2);
        var marginY = 100;
        return {width: width, height: height, left: marginX, right: marginX, top: marginY, bottom: marginY};
    }

    /**
     * setsDimensionStyles on chartElement
     * @param chartElement
     * @param chartDimensions
     */
    function setChartElementStyles (chartElement, chartDimensions) {
        chartElement.setAttribute('style', 'width:100%;height:' + chartDimensions.height);
        chartElement.style.width = '100%';
        chartElement.style.height = chartDimensions.height;
    }

    /**
     * Gets max and min values in data set
     * @param data
     * @returns {{}}
     */
    function getRangeValues(data){
        var result = {};
        var x = [];
        var y = [];
        for (var i = 0; i < data.length; i++) {
            x = x.concat(data[i].x);
            y = y.concat(data[i].y);
        }
        result.xMax = Math.max.apply(null, x);
        result.xMin = Math.min.apply(null, x);
        result.yMax = Math.max.apply(null, y);
        result.yMin = Math.min.apply(null, y);
        return result;
    }

    /**
     * Sets handler to redraw chart on window resize
     */
    function handleResize() {
        var timeOut;
        window.addEventListener('resize', function(){
            clearTimeout(timeOut);
            timeOut = setTimeout(function(){
                d3.selectAll("#chart > *").remove();
                drawSvgChart(data);
            }, 2000);
        })
    }

    /**
     * adjusts y axis label position to prevent overlap with y axis tick labels
     */
    function arrangeLabels() {
        var yLabel = document.getElementById('svgChartYLabel');
        var yLabelBounds = yLabel.getBoundingClientRect();
        var yAxis = document.querySelector('#chart .y.axis');
        var yAxisBounds = yAxis.getBoundingClientRect();
        var overlap = yLabelBounds.left + yLabelBounds.width - yAxisBounds.left;
        if (overlap > 0) {
            var currentYVal = Number(yLabel.getAttribute('y'));
            yLabel.setAttribute('y', currentYVal - overlap);
        }
    }

})();