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
  const authType = core.getInput('auth-type');
  const authToken = core.getInput('auth-token');
  const client = new github.GitHub(token);
  const payload = github.context.payload;
  const title = payload.pull_request.title;
  const status = payload.action;

  var attributes = title.split('/');
  var id = attributes[2];
  if (!id || isNaN(id)) {
    return;
  }
  var formattedUrl = url.format(id, status);
  request({
    url: formattedUrl,
    headers: {
      "Authorization": '{0} {1}'.format(authType, authToken)
    }
  }, function(error, response, body) {
    console.log('url', formattedUrl);
    console.log('request', body);
  });
} catch (error) {
  console.error(error.message);
}
