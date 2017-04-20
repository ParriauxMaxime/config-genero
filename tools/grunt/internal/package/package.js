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
  require("./repack")(grunt);
  require("./zipArchive")(grunt);
  grunt.config.merge({
    copy: {
      pkgSrc: {
        files: [{
            expand: true,
            src: ["Readme.md", "VERSION", "PRODUCTINFO"],
            dest: "dist/package"
          }, {
            expand: true,
            cwd: "tools/grunt/internal/package/files/",
            src: ["Gruntfile.js"],
            dest: "dist/package"
          }, {
            expand: true,
            src: ["src/js/**", "src/resources/**", "src/locales/**", "src/sass/**"],
            dest: "dist/package"
          }, {
            expand: true,
            src: "customization/default/**",
            dest: "dist/package"
          }, {
            expand: true,
            src: "customization/template/**",
            dest: "dist/package"
          }, {
            expand: true,
            src: ["src/index.html", "src/bootstrapParams.tpl"],
            dest: "dist/package"
          }, {
            expand: true,
            cwd: "tools/grunt/",
            src: ["common/**", "build/**"],
            dest: "dist/package/.grunt"
          }, {
            expand: true,
            cwd: "tools/grunt/public",
            src: ["**"],
            dest: "dist/package/.grunt"
          }, {
            expand: true,
            cwd: "tools/grunt/internal/package/files/",
            src: ["defaults.json"],
            dest: "dist/package/.grunt"
          }, {
            expand: true,
            cwd: "tools/grunt/internal/package/files/",
            src: ["defaults.custom.json"],
            dest: "dist/package/",
            rename: function(x) {
              return x + "custom.json";
            }
          },
          /*         {expand:true, cwd:"tools/grunt/public/", src:["injection.js"], dest:"dist/package/.grunt/custom"}
           */
        ]
      }
    },
    repack: {
      packjson: {
        options: {
          remove: [
            "co",
            "glob",
            "grunt-contrib-connect",
            "grunt-contrib-jshint",
            "grunt-githooks",
            "grunt-gitinfo",
            "grunt-jsbeautifier",
            "grunt-jsdoc",
            "grunt-protractor-runner",
            "grunt-todo",
            "jasmine",
            "jasminewd2",
            "markdown",
            "mkdirp",
            "protractor",
            "q",
            "selenium-webdriver"
          ]
        },
        files: [{
          src: "package.json",
          dest: "dist/package"
        }]
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.registerTask("package", "Create public source package", ["copy:pkgSrc", "repack:packjson", "__packageArchive"]);
};
