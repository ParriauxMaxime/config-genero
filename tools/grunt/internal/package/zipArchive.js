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
  require("../../common/buildinfo")(grunt);
  var path = require("path"),
    fs = require("fs");
  let version = grunt.file.read("VERSION").toString().trim(),
    build = grunt.config.get("gbcinfo.buildnumber");
  grunt.registerTask("__injectBUILD", function() {
    fs.writeFileSync("dist/package/BUILD", build, "utf8");
  });
  grunt.config.merge({
    // use custom extension for the output file
    compress: {
      package: {
        options: {
          mode: 'zip',
          archive: "archive/fjs-gbc-" + version + "-build" + build + "-project.zip"
        },
        files: [{
          expand: true,
          cwd: "dist/package",
          dot: true,
          src: ["**"],
          dest: "gbc-" + version + "/"
        }]
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-compress");

  grunt.registerTask("__packageArchive", ["__injectBUILD", "compress:package"]);
};
