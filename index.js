'use strict';

window.onload = (function() {

  var markdownContent = ["item1", "item2"];

  const hljs = require("highlight.js");
  const $ = function(elemID) {
    const elem = document.getElementById(elemID);
    if (!elem) {
      console.error("Unknown element: " +  elemID);
    }
    return elem;
  };

  const RACCOON_GITHUB_REPO_URL_LS_KEY = "RACCOON_GITHUB_REPO_URL_LS_KEY";
  const RACCOON_GITHUB_API_TOKEN_LS_KEY = "RACCOON_GITHUB_API_TOKEN_LS_KEY";
  const RACCOON_GITHUB_LABEL_NAME_LS_KEY = "RACCOON_GITHUB_LABEL_NAME_LS_KEY";
  const RACCOON_MARKDOWN_PREFIX_LS_KEY = "RACCOON_MARKDOWN_PREFIX_LS_KEY";
  const RACCOON_MARKDOWN_HEADER_LS_KEY = "RACCOON_MARKDOWN_HEADER_LS_KEY";
  const RACCOON_MARKDOWN_FOOTER_LS_KEY = "RACCOON_MARKDOWN_FOOTER_LS_KEY";
  const RACCOON_MARKDOWN_CONTENT_LS_KEY = "RACCOON_MARKDOWN_CONTENT_LS_KEY";

  restoreFormValues();

  hljs.initHighlighting();

  generateMarkdown();

  $("md-header").addEventListener("input", function(e) {
    generateMarkdown();
  });

  $("md-footer").addEventListener("input", function(e) {
    generateMarkdown();
  });

  $("md-prefix").addEventListener("input", function(e) {
    generateMarkdown();
  });

  $("repo-url").addEventListener("input", function(e) {
    removeErrorBorder(this);
  });

  $("api-token").addEventListener("input", function(e) {
    removeErrorBorder(this);
  });

  $("label-name").addEventListener("input", function(e) {
    removeErrorBorder(this);
  });

  $("gen-md").addEventListener("click", function(e) {

    e.preventDefault();

    const repoURL = $("repo-url").value;
    const apiToken = $("api-token").value;
    const labelName = $("label-name").value;

    if (!repoURL || repoURL.length == 0) {
      setErrorBorder($("repo-url"));
      return;
    }

    if (!apiToken|| apiToken.length == 0) {
      setErrorBorder($("api-token"));
      return;
    }

    if (!labelName || labelName.length == 0) {
      setErrorBorder($("label-name"));
      return;
    }

    const url = require('url').parse(repoURL);
    const paths = url.pathname.split("/");
    const owner = paths[1];
    const repo = paths[2];
    if (!owner || !repo) {
      setErrorBorder($("repo-url"));
      return;
    }

    const raccoon_cmd = "node raccoon_cli/raccoon_cli.js";
    const opt = "--owner " + owner + " --repo " + repo + " --label " + labelName;
    const cmd = "RACCOON_GITHUB_API_TOKEN=" + apiToken + " "
    + raccoon_cmd + " "
    + opt;
    const exec = require("remote").require("child_process").exec;

    $("gen-md").classList.add("pure-button-disabled");
    exec(cmd, function(err, stdout, stderr) {
      $("gen-md").classList.remove("pure-button-disabled");
      if (err) {
        console.error(err);
        console.error("---");
        console.error(stderr);
        return;
      }

      const markdown = [];
      stdout.trim().split("\n").forEach(function(line) {
        markdown.push(line.trim());
      });

      markdownContent = markdown;

      generateMarkdown();

      storeToLocalStroage(RACCOON_GITHUB_REPO_URL_LS_KEY, $("repo-url"));
      storeToLocalStroage(RACCOON_GITHUB_API_TOKEN_LS_KEY, $("api-token"));
      storeToLocalStroage(RACCOON_GITHUB_LABEL_NAME_LS_KEY, $("label-name"));
      localStorage.setItem(RACCOON_MARKDOWN_CONTENT_LS_KEY, markdownContent.join("\n"));
    });
  });


  function generateMarkdown() {

    const header = $("md-header").value.trim();
    const footer = $("md-footer").value.trim();
    const prefix = $("md-prefix").value.trim();

    const markdown = [];
    if (header.length > 0) {
      markdown.push(header, "");
    }

    markdownContent.forEach(function(l) {
      if (l.length > 0 ){
        markdown.push(prefix + " " + l);
      } else {
        markdown.push("");
      }
    });

    if (footer.length > 0) {
      markdown.push("", footer);
    }

    const dmArea = $("md-area");
    dmArea.textContent = markdown.join("\n");
    hljs.highlightBlock(dmArea);

    storeToLocalStroage(RACCOON_MARKDOWN_PREFIX_LS_KEY, $("md-prefix"));
    storeToLocalStroage(RACCOON_MARKDOWN_HEADER_LS_KEY, $("md-header"));
    storeToLocalStroage(RACCOON_MARKDOWN_FOOTER_LS_KEY, $("md-footer"));
  }

  $("copy-clipboard").addEventListener("click", function(e) {
    e.preventDefault();

    const clipboard = require('electron').clipboard;
    const text = $("md-area").textContent;
    clipboard.writeText(text);

    const btnText = this.textContent;
    this.textContent = "Copied!"
    const self = this;
    setTimeout(function() {
      self.textContent = btnText;
    }, 200);
  });

  // ---

  function restoreFormValues() {
    restoreFromLocalStorage(RACCOON_GITHUB_REPO_URL_LS_KEY, $("repo-url"));
    restoreFromLocalStorage(RACCOON_GITHUB_API_TOKEN_LS_KEY, $("api-token"));
    restoreFromLocalStorage(RACCOON_GITHUB_LABEL_NAME_LS_KEY, $("label-name"));
    restoreFromLocalStorage(RACCOON_MARKDOWN_PREFIX_LS_KEY, $("md-prefix"));
    restoreFromLocalStorage(RACCOON_MARKDOWN_HEADER_LS_KEY, $("md-header"));
    restoreFromLocalStorage(RACCOON_MARKDOWN_FOOTER_LS_KEY, $("md-footer"));
    const content = localStorage.getItem(RACCOON_MARKDOWN_CONTENT_LS_KEY);
    if (content) {
      markdownContent = content.split("\n");
    }
  }

  function storeToLocalStroage(key, elem) {
    const ls = localStorage;
    ls.setItem(key, elem.value);
  }

  function restoreFromLocalStorage(key, elem) {
    const ls = localStorage;
    const value = ls.getItem(key);
    if (value) {
      elem.value = value;
    }
  }

  function setErrorBorder(elem) {
    elem.style["border-color"] = "red";
  }

  function removeErrorBorder(elem) {
    if (elem.style["border-color"]) {
      elem.style["border-color"] = "";
    }
  }
});

