var fs = require('fs-extra');
var D3Node = require('d3-node');

var options = {
    radius: 5,
    width: 600,
    height: 600,
    factor: 1,
    factorLegend: .85,
    levels: 3,
    maxValue: 1,
    radians: 2 * Math.PI
}

module.exports = {
    compile: function(data) {
        this.createCharts(data);
    },

    createCharts: function(data) {
        fs.removeSync('./.charts');

        var candidates = Object.keys(data.candidates);

        candidates.forEach(function(candidate) {
            if (Object.keys(data.candidates[candidate]).length > 0) {
                this.createChart(candidate, data.candidates[candidate]);
            } else {
                console.log('insufficient data for ' + candidate);
            }
        }.bind(this));
    },

    createChart: function(candidate, data) {
        var d3n = new D3Node();
        var d3 = d3n.d3;
        var svg = d3n.createSVG()
            .attr('class', 'uit-radar')
            .attr('viewBox', '0 0 ' + options.width + ' ' + options.height)
            .append('g');

        var allAxis = (data.map(function(i, j) { return i.area }));
        var total = allAxis.length;
        var radius = options.factor * Math.min(options.width / 2, options.height / 2);

        var axis = svg.selectAll('.axis')
            .data(allAxis)
            .enter()
            .append('g')
            .attr('class', 'axis');

        axis.append('line')
            .attr('x1', options.width / 2)
            .attr('y1', options.height / 2)
            .attr('x2', function(d, i) { return options.width / 2 * (1-options.factor * Math.sin(i * options.radians / total)) })
            .attr('y2', function(d, i) { return options.height / 2 * (1-options.factor * Math.cos(i * options.radians / total)) })
            .attr('class', 'line')
            .style('stroke', 'grey')
            .style('stroke-width', '1px');

        var dataValues = []

        data.forEach(function(j, i) {
            dataValues.push([
                options.width/2*(1-(parseFloat(Math.max(j.value, 0))/options.maxValue)*options.factor*Math.sin(i*options.radians/total)),
                options.height/2*(1-(parseFloat(Math.max(j.value, 0))/options.maxValue)*options.factor*Math.cos(i*options.radians/total))
            ])
        });

        dataValues.push(dataValues[0]);

        svg.selectAll('.area')
            .data([dataValues])
            .enter()
            .append('polygon')
            .attr('class', 'radar-chart')
            .style('stroke-width', '2px')
            .style('stroke', '#FFBB00')
            .attr('points', function(d) {
                console.log('drawing points');
                var str = '';
                for (var i = 0; d.length > i; i++) {
                    str = str + d[i][0] + ',' + d[i][1] + ' ';
                }
                return str;
            })
            .style('fill', 'red')


        fs.mkdirsSync('./.charts');
        fs.writeFileSync('./.charts/' + this.handlise(candidate) + '.svg', d3n.svgString());
    },

    handlise: function(string) {
        return string.replace(/ /g, '-').toLowerCase();
    }
}
