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
  var path = require("path");
  grunt.config.merge({
    replace: {
      version: {
        src: [
          path.join(grunt.__gbcCurrentPathes.distWeb, "PRODUCTINFO"),
          path.join(grunt.__gbcCurrentPathes.distWeb, "VERSION"),
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
            return version.trim();
          }
        }, {
          from: "%%BUILD%%",
          to: function() {
            var timestamp = +(grunt.config.get("gitinfo.currentVersionTimeStamp") || 0);
            return "" + grunt.template.date(timestamp * 1000, "yyyymmddHHMM");
          }
        }, {
          from: "%%TAG%%",
          to: function() {
            var tag = (grunt.config.get("gitinfo.currentVersionTag") || "").replace(/([^\^]*)(?:\^.*)?$/, "$1");
            return tag === "undefined" ? "dev-snapshot" : tag;
          }
        }, {
          from: "%%DIRTY%%",
          to: function() {
            var tag = (grunt.config.get("gitinfo.currentVersionChanges") || "");
            return tag.length ? "-d" + grunt.template.date(new Date().getTime(), "yyyymmddHHMM") : "";
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
