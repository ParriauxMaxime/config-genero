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

module.exports = function(grunt) {
  grunt.config.merge({
    githooks: {
      all: {
        "pre-commit": "githooksPreCommit"
      }
    }
  });
  var childprocess = require("child_process");
  grunt.registerTask("dirtyCheck", "check local git dirty state", function() {
    var a = childprocess.execSync("git status --porcelain");
    a = a.toString();
    a = a.replace(/^((?:(?:[a-zA-Z] )|(?: [a-zA-Z])) .+)$/gm, "")
      .replace(/^\?\?.+$/gm, "")
      .replace(/^\r|\n$/gm, "");
    if (a) {
      console.log(a);
    }
    return a === "";
  });
  require("./codecheck")(grunt);
  grunt.registerTask("githooksPreCommit", "preCommit", function() {
    grunt.task.run(["gitcodecheck", "dirtyCheck"]);
  });
  grunt.loadNpmTasks("grunt-githooks");
};
