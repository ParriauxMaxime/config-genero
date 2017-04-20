/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

var path = require("path");
module.exports = function(grunt) {

  var childProcess = require("child_process");

  function getGitModifiedFiles() {
    var modifiedFiles = [];
    try {
      var gitOutput = childProcess.execSync("git status --porcelain").toString().split("\n");
      for (var i = 0; i < gitOutput.length; ++i) {
        var line = gitOutput[i];
        if (line.length > 2 && ('MARCU'.indexOf(line[0]) !== -1 || 'MARCU'.indexOf(line[1]) !== -1)) {
          modifiedFiles.push(line.substr(3));
        }
      }
    } catch (ignore) {
      grunt.log.warn("git not available");
    }
    return modifiedFiles;
  }

  var gitModifiedFiles = getGitModifiedFiles();
  var gitModifiedJsFiles = gitModifiedFiles.filter(function(filepath) {
    return filepath === 'Gruntfile.js' ||
      /.*\.json$/.test(filepath) ||
      /src\/js\/.*\.js$/.test(filepath) ||
      /src\/node\/.*\.js$/.test(filepath) ||
      /tests\/.*\.spec\.js$/.test(filepath) ||
      /tools\/grunt\/.*\.js$/.test(filepath);
  });

  grunt.config.merge({
    jsbeautifier: {
      options: {
        config: path.join(__dirname, "beautifier.config.json"),
        mode: "VERIFY_AND_WRITE"
      },
      default: {
        src: [
          "Gruntfile.js",
          "*.json",
          "src/js/**/*.js",
          "src/node/**/*.js",
          "tests/**/*.spec.js",
          "tools/grunt/**/*.js",
          "!src/doc/**"
        ]
      },
      git: {
        src: gitModifiedJsFiles
      }
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      default: {
        files: {
          src: [
            "Gruntfile.js",
            "src/js/**/*.js",
            "src/node/**/*.js",
            "tools/grunt/**/*.js"
          ]
        }
      },
      git: {
        files: {
          src: gitModifiedJsFiles
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsbeautifier");

  grunt.registerTask("codecheck", ["jsbeautifier:default", "jshint:default"]);
  grunt.registerTask("gitcodecheck", ["jsbeautifier:git", "jshint:git"]);
};
