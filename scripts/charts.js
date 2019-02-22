var fs = require('fs-extra');
var D3Node = require('d3-node');

module.exports = {
    compile: function(data) {
        this.createCharts(data);
    },

    createCharts: function(data) {
        fs.removeSync('./.charts');

        var candidates = Object.keys(data.candidates);

        candidates.forEach(function(candidate) {
            this.createChart(candidate, data.candidates[candidate]);
        }.bind(this))
    },

    createChart: function(candidate, data) {
        d3 = new D3Node();
        d3.createSVG(10,20).append('g');
        fs.mkdirsSync('./.charts');
        fs.writeFileSync('./.charts/' + this.handlise(candidate) + '.svg', d3.svgString())
    },

    handlise: function(string) {
        return string.replace(/ /g, '-').toLowerCase();
    }
}
