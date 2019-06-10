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
                'climateEmergency': data[2],
                'healthcare': data[3],
                'taxes': data[4],
                'gunControl': data[5],
                'tech': data[6],
                'fundingForBorderSecurity': data[7],
                'ice': data[8],
                'impeachment': data[9],
                'abortion': data[10],
                'campaignFinance': data[11]
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
        data.groups[group].sort(function(a, b) {
            if (a.candidate < b.candidate) return -1;
            if (a.candidate > b.candidate) return 1;
            return 0;
        });

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

function appendConfigDrivenData(config) {
    data.path = config.absolutePath
    data.isLocal = !config.specs.deploy;

    return data;
}

function abolishICE() {
    delete data.groups['ice'];
    delete data.issues['ice'];

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
            data = abolishICE();
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
