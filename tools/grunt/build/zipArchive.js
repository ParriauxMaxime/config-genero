/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

module.exports = function(grunt) {
  require("../common/buildinfo")(grunt);
  var path = require("path");
  let customizationId = (grunt.__gbcOptions.compile.customization !== "NONE" && grunt.__gbcOptions.compile.customization) || "runtime",
    version = grunt.file.read("VERSION").toString().trim(),
    build = grunt.config.get("gbcinfo.buildnumber");
  grunt.config.merge({
    // use custom extension for the output file
    compress: {
      archive: {
        options: {
          mode: 'zip',
          archive: "archive/fjs-gbc-" + version + "-build" + build + "-" + customizationId.replace(/\\|\//g, "_") + ".zip"
        },
        files: [{
          expand: true,
          dot: true,
          cwd: path.join(grunt.__gbcCurrentPathes.distWeb, "./"),
          src: ["**"],
          dest: "/"
        }]
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-compress");

  grunt.registerTask("__archive", ["compress:archive"]);
};
