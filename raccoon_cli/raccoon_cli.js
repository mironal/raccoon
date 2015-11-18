'use strict';

var package_json = require('./package.json');
var getOpt = require('node-getopt').create([
  ['l' ,'label=<label name>', 'Label name of issue.'],
  ['o' ,'owner=<owner name>', 'Owner of repo. required if set --label option.'],
  ['r', 'repo=<repo name>',  'Repository name. required if set --label option.'],
  ['h' ,'help'     , 'display this help.'],
])
.bindHelp(
  "Usage: node " + package_json.name + " [OPTIONS]\n\n" +
    "Environment variable: RACCOON_GITHUB_API_TOKEN=<your github api token> is require.\n\n" +
    "[[OPTIONS]]\n\n" +
    "version: " + package_json.version
);

var opt = getOpt.parseSystem();

var TOKEN = process.env.RACCOON_GITHUB_API_TOKEN;
if (!TOKEN ) {
  console.error("RACCOON_GITHUB_API_TOKEN is not specified.");
  console.error("Make How ? => https://github.com/settings/tokens")
  process.exit(1);
}

if (!opt.options.label || !opt.options.owner || !opt.options.repo) {
  getOpt.showHelp();
  process.exit(1);
}

var GitHubApi = require("github");
var github = new GitHubApi({
  version: "3.0.0"
});

github.authenticate({
  type: "oauth",
  token: TOKEN
});

var owner = opt.options.owner;
var repo = opt.options.repo;
var label = opt.options.label;

github.issues.repoIssues({"user": owner, "repo": repo, "labels": label, per_page: 100}, function(error, resp) {
  if (error) {
    console.error(error);
    process.exit(1);
  } else {

    for (var i = 0; i < resp.length; i++) {
      var issue = resp[i];
      console.log(issue.title);
    }
  }
});

