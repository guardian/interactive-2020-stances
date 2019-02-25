var fs = require('fs-extra');
var D3Node = require('d3-node');

var options = {
    radius: 5,
    width: 400,
    height: 400,
    factor: 1,
    factorLegend: 1.2,
    maxValue: 1.9,
    radians: 2 * Math.PI,
    pointRadius: 6,
    margin: 80
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
                this.createChart(candidate, data.candidates[candidate], data);
            } else {
                console.log('insufficient data for ' + candidate);
            }
        }.bind(this));
    },

    createChart: function(candidate, data, fullData) {
        var d3n = new D3Node();
        var d3 = d3n.d3;
        var svg = d3n.createSVG()
            .attr('class', 'uit-radar')
            .attr('viewBox', '0 0 ' + (options.width + (options.margin * 2)) + ' ' + (options.height + (options.margin * 2)))
            .append('g')
            .attr('transform', 'translate(' + options.margin + ',' + options.margin + ')')

        var allAxis = (data.map(function(i, j) { return i }));
        var total = allAxis.length;
        var radius = options.factor * Math.min(options.width / 2, options.height / 2);

        var dataValues = []

        data.forEach(function(j, i) {
            dataValues.push([
                options.width/2*(1-(parseFloat(Math.max(j.value, 0))/options.maxValue)*options.factor*Math.sin(i*options.radians/total)),
                options.height/2*(1-(parseFloat(Math.max(j.value, 0))/options.maxValue)*options.factor*Math.cos(i*options.radians/total))
            ])
        });

        dataValues.push(dataValues[0]);

        svg.append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewbox', '0 0 10 10')
            .attr('refX', 0)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
                .attr('d', "M 0 0 L 10 5 L 0 10 z")
                .attr("class","uit-radar__arrow");

        svg.selectAll('.uit-radar__area')
            .data([dataValues])
            .enter()
            .append('polygon')
            .attr('class', 'uit-radar__area')
            .attr('points', function(d) {
                var str = '';
                for (var i = 0; d.length > i; i++) {
                    str = str + d[i][0] + ',' + d[i][1] + ' ';
                }
                return str;
            });

        var axis = svg.selectAll('.uit-radar__axis')
            .data(allAxis)
            .enter()
            .append('g')
            .attr('class', 'uit-radar__axis');

        axis.append('line')
            .attr('x1', options.width / 2)
            .attr('y1', options.height / 2)
            .attr('x2', function(d, i) { return options.width / 2 * (1-options.factor * Math.sin(i * options.radians / total)) })
            .attr('y2', function(d, i) { return options.height / 2 * (1-options.factor * Math.cos(i * options.radians / total)) })
            .attr('class', 'uit-radar__guideline');

        axis.append('text')
            .text(function(d) { return d.title; })
            .attr('x', function(d, i) { return options.width / 2 * (1-options.factorLegend * Math.sin(i * options.radians / total)) })
            .attr('y', function(d, i) { return options.height / 2 * (1-options.factorLegend * Math.cos(i * options.radians / total)) })
            .attr('class', 'uit-radar__axis-label')


        dataValues = dataValues.filter(function(item, pos) {
            return dataValues.indexOf(item) == pos;
        })

        svg.selectAll('.uit-radar__point')
            .data(dataValues)
            .enter()
            .append('circle')
            .attr('cx', function(d, i) { return d[0] })
            .attr('cy', function(d, i) { return d[1] })
            .attr('data-group', function(d, i) { if (data[i]) { return data[i].group } })
            .attr('r', options.pointRadius)
            .attr('class', 'uit-radar__point');

        fs.mkdirsSync('./.charts');
        fs.writeFileSync('./.charts/' + this.handlise(candidate) + '.svg', d3n.svgString());
    },

    handlise: function(string) {
        return string.replace(/ /g, '-').toLowerCase();
    }
}
