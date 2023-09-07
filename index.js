const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request');

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

try {
  const token = core.getInput('github-token');
  const url = core.getInput('url');
  const auth = core.getInput('auth');
  const client = new github.GitHub(token);
  const payload = github.context.payload;
  console.log('payload', payload);
  const title = payload.pull_request.title;
  const prNumber = payload.pull_request.number;
  const status = payload.action;

  if (status === 'closed' && payload.pull_request.merged) {
    status = 'merged'
  }

  var attributes = title.split('/');
  var id = attributes[2];
  if (!id || isNaN(id)) {
    return;
  }
  request({
    url: url.format(id, status, prNumber),
    headers: {
      "Authorization": auth
    }
  }, function(error, response, body) {
    console.log('request', body);
  });
} catch (error) {
  console.error(error.message);
}
