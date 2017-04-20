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
    __compileall: {
      files: {
        src: ["customization/*", "!customization/tests", "customization/tests/*"]
      }
    }
  });
  var execSync = require('child_process').execSync;
  grunt.registerMultiTask("__compileall", "", function() {
    var createZip = grunt.option("create-zip") ? " --create-zip" : "";
    this.files.forEach(function(files) {
      var now = Date.now();
      console.log("compiling without customization");
      execSync("grunt --customization=NONE --build-dist=web" + createZip);
      console.log("Done (" + (Date.now() - now) + " ms)");
      files.src.map(function(file) {
        now = Date.now();
        console.log("compiling with customization : " + file);
        execSync("grunt --customization=" + file + " --build-dist=" + file + createZip);
        console.log("Done (" + (Date.now() - now) + " ms)");
      });
    });
  });
};
