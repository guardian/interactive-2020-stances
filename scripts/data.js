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
                'climateChange': data[2],
                'healthcare': data[3],
                'taxes': data[4],
                'gunControl': data[5],
                'tech': data[6],
                'borderFunding': data[7],
                'ice': data[8],
                'abortion': data[9],
                'campaignFinance': data[10]
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
            if (candidate.stance && data.issues[group].groups[candidate.stance]) {
                data.issues[group].groups[candidate.stance].candidates.push({
                    candidate: candidate.candidate,
                    surname: getSurname(candidate.candidate),
                    quote: fetchQuote(group, candidate)
                });
            } else {
                console.log(`Can\'t find ${candidate.candidate} in ${group}`)
            }
        });
    });

    return data;
}

function getSurname(candidate) {
    candidate = candidate.split(' ')[1];

    if (candidate === 'Hickenlooper') {
        candidate = 'Hicken.';
    }

    return candidate;
}

function fetchQuote(issue, candidate) {
    var stances = data.groups[issue];

    for (var i in stances) {
        if (stances[i].candidate === candidate.candidate && stances[i].quote) {
            return {
                copy: stances[i].quote,
                source: stances[i].source || null
            }
        }
    }

    return null;
}

function prepDataForRadarCharts() {
    var chartsData = {};
    var issues = Object.keys(data.issues);
    var groups = Object.keys(data.groups);

    data.candidates.forEach(function(candidate) {
        chartsData[candidate.candidate] = {};
        chartsData[candidate.candidate].data = [];

        var total = 0;

        issues.forEach(function(issue) {
            data.groups[issue].forEach(function(stance) {
                if (stance.candidate === candidate.candidate) {
                    total += calculateChartValue(issue, stance.stance)
                    chartsData[candidate.candidate].data.push({
                        axis: issue,
                        group: stance.stance,
                        title: data.issues[issue].title,
                        value: calculateChartValue(issue, stance.stance)
                    });
                }
            }.bind(this));
        }.bind(this));

        chartsData[candidate.candidate].total = total;
    }.bind(this));

    data.candidates = chartsData;

    return data;
}

function calculateChartValue(issue, value) {
    var values = Object.keys(data.issues[issue].groups)
    var total = values.length;
    var place = values.indexOf(value);

    if (value) {
        return Math.abs((place / total) - 1) + .25;
    } else {
        return 0
    }
}

function prepDataForMasterChart() {
    var sortedCandidates = [];

    for (var candidate in data.candidates) {
        sortedCandidates.push({
            candidate: candidate,
            total: data.candidates[candidate].total
        });
    }

    sortedCandidates.sort(function(a, b) {
        return b.total - a.total;
    });

    var orderedCandidateData = [];

    sortedCandidates.forEach(function(candidate, i) {
        orderedCandidateData[candidate.candidate] = data.candidates[candidate.candidate];
    });

    data.candidates = orderedCandidateData;

    return data;
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
            data = prepDataForMasterChart();
            delete data.groups;

            // console.log(JSON.stringify(data, null, 4));

            isDone = true;
        });

        deasync.loopWhile(function() {
            return !isDone;
        });
    }

    data = appendConfigDrivenData(config);

    return data;
};
