var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var userHome = require('user-home');
var camelCase = require('camelcase');
var decamelize = require('decamelize');

var data;

function fetchData(id, callback) {
    var keys = require(userHome + '/.gu/interactives.json');

    gsjson({
        spreadsheetId: id,
        allWorksheets: true,
        credentials: keys.google
    })
    .then(function(result) {
        callback(result);
    })
    .then(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function sortResults() {
    if (data.length === 1) {
        data = data[0]
    } else {
        data = {
            'issues': data[0],
            'candidates': data[1]
        }
    }

    return data;
}

function sortIssues() {
    var issues = {};

    for (var i in data.issues) {
        var issue = data.issues[i];

        issues[camelCase(issue.issue)] = {
            'title': issue.issue,
            'description': issue.description,
            'groups': {}
        };

        for (var i = 0; 5 > i; i++) {
            if (issue['group' + i]) {
                issues[camelCase(issue.issue)].groups[issue['group' + i]] = {
                    'title': issue['group' + i],
                    'description': issue['group' + i + 'Description'],
                    'candidates': []
                };
            }
        }
    }

    data.issues = issues;
    return data;
}

function sortCandidatesIntoIssues() {
    data.candidates.forEach(function(candidate) {
        for (var key in candidate) {
            if (data.issues[key]) {
                data.issues[key].groups[candidate[key]].candidates.push(candidate.candidate);
            }
        }

    });

    return data;
}

function prepDataForRadarCharts() {
    var chartsData = {};
    var issues = Object.keys(data.issues);

    data.candidates.forEach(function(candidate) {
        chartsData[candidate.candidate] = [];

        issues.forEach(function(issue) {
            if (candidate[issue]) {
                chartsData[candidate.candidate].push({
                    axis: issue,
                    value: calculateChartValue(issue, candidate[issue]),
                    title: data.issues[issue].title,
                    group: candidate[issue]
                })
            }
        }.bind(this));
    }.bind(this));

    data.candidates = chartsData;

    return data;
}

function calculateChartValue(issue, value) {
    var values = Object.keys(data.issues[issue].groups)
    var total = values.length;
    var place = values.indexOf(value);

    return Math.abs((place / total) - 1) + .7;
}

function appendConfigDrivenData(config) {
    data.path = config.absolutePath
    data.isLocal = !config.specs.deploy;

    return data;
}

module.exports = function getData(config) {
    data = {};

    if (config.data.id !== "") {
        var isDone = false;

        fetchData(config.data.id, function(result) {
            data = result;
            data = sortResults();
            data = sortIssues();
            data = sortCandidatesIntoIssues();
            data = prepDataForRadarCharts();
            // call additional data cleaning functions here

            // console.log(data);

            isDone = true;
        });

        deasync.loopWhile(function() {
            return !isDone;
        });
    }

    data = appendConfigDrivenData(config);

    return data;
};
