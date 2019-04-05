var fs = require('fs-extra');
var D3Node = require('d3-node');

var options = {
    width: 1000,
    height: 300,
    desktopRadius: 31,
    mobileRadius: 20
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
            .attr('height', options.height + 'px');

        var listOfCandidates = Object.keys(candidates);

        options.numberOfNodes = listOfCandidates.length;

        var x = d3.scaleLinear()
            .domain([candidates[listOfCandidates[0]].total, candidates[listOfCandidates[options.numberOfNodes - 1]].total])
            .range([0 + (options.desktopRadius * 2), options.width - (options.desktopRadius * 2)]);

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
            .force('y', d3.forceY(options.height / 2 - options.desktopRadius))
            .force('collide', d3.forceCollide().radius(options.desktopRadius + 3))
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
            .style('clip-path', 'url(#uit-candidates__crop)')
            .attr('style', function(d) { return 'transform: translate(' + (d.x / options.width * 100) + '%, ' + (d.y / options.height * 100) + '%);' });

        circle.append('clipPath')
            .attr('id', function(d) { return this.handlise(d.name) }.bind(this))
            .append('circle')
            .attr('cx', options.desktopRadius)
            .attr('cy', options.desktopRadius)
            .attr('r', options.desktopRadius + 'px');

        circle.append('circle')
            .attr('class', 'uit-candidates__background')
            .attr('cx', options.desktopRadius)
            .attr('cy', options.desktopRadius)
            .attr('r', options.desktopRadius + 'px');

        circle.append('image')
            .attr('class', 'uit-candidates__image')
            .attr('xlink:href', function(d) { return 'assets/' + this.handlise(d.name) + '.png'; }.bind(this))
            .attr('width', options.desktopRadius * 2)
            .attr('height', options.desktopRadius * 2)
            .attr('clip-path', function(d) { return `url(#${this.handlise(d.name)})` }.bind(this));

        fs.mkdirsSync('./.charts');
        fs.writeFileSync('./.charts/master.svg', d3n.svgString());
    },

    handlise: function(string) {
        return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-').toLowerCase();
    }
}
