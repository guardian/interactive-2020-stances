var fs = require('fs-extra');
var D3Node = require('d3-node');

var options = {
    width: 1000,
    height: 500,
    pointRadius: 31
}

module.exports = {
    compile: function(data) {
        this.createChart(data.candidates);
    },

    createChart: function(candidates) {
        var d3n = new D3Node();
        var d3 = d3n.d3;
        var svg = d3n.createSVG()
            .attr('class', 'uit-radar')
            .attr('height', '500px');

        var listOfCandidates = Object.keys(candidates);

        options.numberOfNodes = listOfCandidates.length;

        var x = d3.scaleLinear()
            .domain([candidates[listOfCandidates[0]].total, candidates[listOfCandidates[options.numberOfNodes - 1]].total])
            .range([0 + (options.pointRadius * 2), options.width - (options.pointRadius * 2)]);

        var xAxis = d3.axisBottom(x);

        var nodes = [];

        listOfCandidates.forEach(function(candidate, i) {
            nodes.push({
                index: i,
                value: candidates[candidate].total,
                name: listOfCandidates[i],
                x: x(candidates[candidate].total),
                fx: x(candidates[candidate].total)
            })
        });

        var simulation = d3.forceSimulation(nodes)
            .force('x', d3.forceX(function(d) { return x(d.value) }).strength(1))
            .force('y', d3.forceY(options.height / 2))
            .force('collide', d3.forceCollide().radius(options.pointRadius * 1.8))
            .force('manyBody', d3.forceManyBody().strength(-10))
            .stop();

        for (var i = 0; i < 150; i++) {
            simulation.tick();
        }

        var circle = svg.selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'uit-candidates__candidate')
            .style('clip-path', 'url(#uit-candidates__crop)');

        circle.append('circle')
            .attr('class', 'uit-candidates__background')
            .attr('cx', function(d) { return d.x / options.width * 100 + '%' })
            .attr('cy', function(d) { return d.y / options.height * 100 + '%' })
            .attr('r', options.pointRadius + 'px');

        circle.append('image')
            .attr('class', 'uit-candidates__image')
            .attr('xlink:href', function(d) { return 'assets/' + this.handlise(d.name) + '.png'; }.bind(this))
            .attr('width', options.pointRadius * 2)
            .attr('height', options.pointRadius * 2)
            .attr('x', function(d) { return (d.x - options.pointRadius) / options.width * 100 + '%' })
            .attr('y', function(d) { return (d.y - options.pointRadius) / options.height * 100 + '%' })

        fs.mkdirsSync('./.charts');
        fs.writeFileSync('./.charts/master.svg', d3n.svgString());
    },

    handlise: function(string) {
        console.log(string);
        return string.replace(/ /g, '-').toLowerCase();
    }
}
