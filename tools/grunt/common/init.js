/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

module.exports = function(grunt) {
  require("time-grunt")(grunt);

  // Project configuration.
  grunt.config.init({
    pkg: grunt.file.readJSON("package.json")
  });

  var tasks = grunt && grunt.cli && grunt.cli.tasks && grunt.cli.tasks;

  grunt.registerTask("deps", "[DEPRECATED]", function() {
    console.log("[DEPRECATED]. Not needed anymore.");
  });

  return {
    taskmatch: function(re) {
      return !re || !!tasks && !!tasks.filter(i => i && re.test(i)).length;
    }
  };
};
