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
    __clean: {
      default: ["dist", ".cache", "archive"],
      tests: ["tests/**/*.42m", "tests/**/*.42f", "tests/**/*.gar"],
      orig: ["*.orig", "src/**/*.orig", "tests/**/*.orig", "tools/**/*.orig"],
      dependencies: ["node_modules", /*for older*/ "bower_components"]
    }
  });
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.renameTask("clean", "__clean");
  grunt.registerTask("clean", ["__clean:default"]);
  grunt.registerTask("cleantests", ["__clean:tests"]);
  grunt.registerTask("cleanorig", ["__clean:orig"]);
  grunt.registerTask("cleanall", ["clean", "cleantests", "cleanorig", "__clean:dependencies"]);
};
