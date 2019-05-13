var fs = require('fs-extra');
var D3Node = require('d3-node');

var options = {
    width: 1000,
    height: 450,
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
        var html = d3n.d3Element.append('div')
            .attr('class', 'uit-candidates__map');

        var listOfCandidates = Object.keys(candidates);

        options.numberOfNodes = listOfCandidates.length;

        var x = d3.scaleLinear()
            .domain([candidates[listOfCandidates[0]].total, candidates[listOfCandidates[options.numberOfNodes - 1]].total])
            .range([0, options.width - (options.desktopRadius * 4)]);

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
            .force('collide', d3.forceCollide().radius(options.desktopRadius * 2))
            .force('manyBody', d3.forceManyBody().strength(-10))
            .stop();

        for (var i = 0; i < 150; i++) {
            simulation.tick();
        }

        var candidate = html.selectAll('div')
            .data(nodes)
            .enter()
            .append('div')
            .attr('class', 'uit-candidates__candidate is-tooltipable')
            .attr('style', function(d) { return 'left:' + (d.x / options.width * 100) + '%; top:' + ((d.y - options.desktopRadius) / options.height * 100) + '%;' })

        candidate.append('img')
            .attr('class', 'uit-candidates__candidate-image')
            .attr('src', function(d) { return 'assets/' + this.handlise(d.name) + '.png'; }.bind(this))

        fs.mkdirsSync('./.charts');
        fs.writeFileSync('./.charts/master.html', html.html());
    },

    handlise: function(string) {
        return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '-').replace('\'', '').toLowerCase();
    }
}
