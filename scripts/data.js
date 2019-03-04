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
            'candidates': data[1],
            'groups': {
                'tech': data[2],
                'climateChange': data[3],
                'healthcare': data[4],
                'gunControl': data[5],
                'immigration': data[6],
                'taxes': data[7],
                'abortion': data[8]
            }
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
    var groups = Object.keys(data.groups);

    groups.forEach(function(group) {
        data.groups[group].forEach(function(candidate) {
            data.issues[group].groups[candidate.stance].candidates.push({
                candidate: candidate.candidate,
                quote: "cool cool cool"
            });
        });
    });

    return data;
}

function prepDataForRadarCharts() {
    var chartsData = {};
    var issues = Object.keys(data.issues);
    var groups = Object.keys(data.groups);

    data.candidates.forEach(function(candidate) {
        chartsData[candidate.candidate] = [];

        issues.forEach(function(issue) {
            data.groups[issue].forEach(function(stance) {
                if (stance.candidate === candidate.candidate) {
                    chartsData[candidate.candidate].push({
                        axis: issue,
                        group: stance.stance,
                        title: data.issues[issue].title,
                        value: calculateChartValue(issue, stance.stance)
                    });
                }
            }.bind(this));
        }.bind(this));
    }.bind(this));

    data.candidates = chartsData;

    return data;
}

function calculateChartValue(issue, value) {
    var values = Object.keys(data.issues[issue].groups)
    var total = values.length;
    var place = values.indexOf(value);

    return Math.abs((place / total) - 1) + .25;
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
            delete data.groups;

            console.log(JSON.stringify(data, null, 4));

            isDone = true;
        });

        deasync.loopWhile(function() {
            return !isDone;
        });
    }

    data = appendConfigDrivenData(config);

    return data;
};
