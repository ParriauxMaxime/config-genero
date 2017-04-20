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
  require("./build")(grunt);
  grunt.config.merge({
    watch: {
      options: {
        atBegin: true
      },
      scss: {
        files: [
          "src/**/*.scss",
          "src/**/*.scss.json",
          grunt.__gbcCurrentPathes.customizationPath + "/**/*.scss",
          grunt.__gbcCurrentPathes.customizationPath + "/**/*.scss.json"
        ],
        tasks: ["__stylesheets"]
      },
      js: {
        files: [
          "src/js/**/*.js",
          "src/**/*.scss.json",
          grunt.__gbcCurrentPathes.customizationPath + "/**/*.js",
          grunt.__gbcCurrentPathes.customizationPath + "/**/*.scss.json",
          "tests/**/*.js",
          "src/index.html",
          "src/bootstrapParams.tpl"
        ],
        tasks: ["__theme", "__compilejs", "__html"]
      },
      templates: {
        files: [
          "src/js/**/*.tpl.html",
          grunt.__gbcCurrentPathes.customizationPath + "/**/*.tpl.html"
        ],
        tasks: ["__templates"]
      },
      locales: {
        files: [
          "src/locales/**/*.json",
          grunt.__gbcCurrentPathes.customizationPath + "/**/locales/**/*.json"
        ],
        tasks: ["__locales"]
      },
      resources: {
        files: [
          "src/resources/**",
          grunt.__gbcCurrentPathes.customizationPath + "/resources/**"
        ],
        tasks: ["__resources"]
      }
    },
    concurrent: {
      dev: {
        tasks: ["watch:scss", "watch:js", "watch:templates", "watch:resources", "watch:locales"],
        options: {
          logConcurrentOutput: true,
          limit: 6
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("dev", ["__compile", "concurrent:dev"]);
};
