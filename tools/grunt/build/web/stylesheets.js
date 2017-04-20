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

  var fs = require("fs");
  var path = require("path");

  var sassTarget = {};
  sassTarget[".cache/" + grunt.__gbcCurrentPathes.distWebFlat + "/css/main.css"] = "src/sass/main.scss";

  grunt.config.merge({
    autoprefixer: {
      options: {
        browsers: "last 1 version"
      },
      css: {
        expand: true,
        cwd: ".cache/" + grunt.__gbcCurrentPathes.distWebFlat,
        src: "css/**/*.css",
        dest: grunt.__gbcCurrentPathes.distWeb
      }
    },
    sass: {
      development: {
        options: {
          outputStyle: "compact",
          importer: require("../sassImporter")(grunt).scssJsonImporter
        },
        files: sassTarget
      }
    },
    usebanner: {
      options: {
        position: "top",
        replace: function(contents, newBanner) {
          var charset = '@charset "UTF-8";\n',
            idx = contents.indexOf(charset),
            banner =
            `/*
 * FOURJS_START_COPYRIGHT(D,2014)
 * Property of Four Js*
 * (c) Copyright Four Js 2014, 2017. All Rights Reserved.
 * * Trademark of Four Js Development Tools Europe Ltd
 *   in the United States and elsewhere
 * 
 * This file can be modified by licensees according to the
 * product manual.
 * FOURJS_END_COPYRIGHT
 */
 `,
            skip = idx === 0 ? charset.length : 0;
          return charset + banner + contents.slice(skip);
        },
        linebreak: false
      },
      css: {
        src: [path.join(grunt.__gbcCurrentPathes.distWeb, '/css/**/*.css')]
      }
    }
  });
  grunt.loadNpmTasks("grunt-autoprefixer");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-banner");

  grunt.registerTask("__stylesheets", ["sass:development", "autoprefixer:css", "usebanner:css"]);
};
