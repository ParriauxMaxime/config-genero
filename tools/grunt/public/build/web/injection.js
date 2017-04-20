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
  var getBuildNumber = function() {
    return grunt.template.date(new Date().getTime(), "yyyymmddHHMM");
  };

  var path = require("path");
  grunt.config.merge({
    replace: {
      version: {
        src: [
          path.join(grunt.__gbcCurrentPathes.distWeb, "VERSION"),
          path.join(grunt.__gbcCurrentPathes.distWeb, "PRODUCTINFO"),
          path.join(grunt.__gbcCurrentPathes.distWeb, "js/gbc.js"),
          path.join(grunt.__gbcCurrentPathes.distWeb, "src/js/sysinit/gbc.js")
        ],
        overwrite: true,
        replacements: [{
          from: "%%YEAR%%",
          to: function() {
            return new Date().getFullYear();
          }
        }, {
          from: "%%VERSION%%",
          to: function() {
            var version = grunt.file.read("VERSION").toString();
            return version.trim() + ".c";
          }
        }, {
          from: "%%BUILD%%",
          to: function() {
            return getBuildNumber();
          }
        }, {
          from: "%%TAG%%",
          to: function() {
            var version = grunt.file.read("VERSION").toString();
            return version.replace("\n", "") + ".c";
          }
        }, {
          from: "%%DIRTY%%",
          to: function() {
            return "";
          }
        }]
      },
      prod: {
        src: [
          path.join(grunt.__gbcCurrentPathes.distWeb, "js/gbc.js"),
          path.join(grunt.__gbcCurrentPathes.distWeb, "src/js/sysinit/gbc.js")
        ],
        overwrite: true,
        replacements: [{
          from: "%%PROD%%",
          to: function() {
            grunt.log.writeln("prodmode : +" + grunt.__gbcOptions.compile.mode);
            var prod = grunt.__gbcOptions.compile.mode === "prod";
            return prod ? "prod" : "";
          }
        }]
      }
    }
  });
  grunt.loadNpmTasks("grunt-text-replace");

  grunt.registerTask("__injection", ["gitinfo", "replace:version", "replace:prod"]);
};
