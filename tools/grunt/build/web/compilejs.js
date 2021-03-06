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
  var path = require("path");
  var includes = [];
  includes = includes.concat(
    grunt.__gbcCurrentPathes.libraries,
    path.join(grunt.__gbcCurrentPathes.distWeb, "js/compiledLocales.js"),
    path.join(grunt.__gbcCurrentPathes.distWeb, "js/compiledTemplates.js")
  );

  if (grunt.__gbcCompileMode === "dev") {
    includes = includes.concat(grunt.__gbcCurrentPathes.sources.map(p => path.join(grunt.__gbcCurrentPathes.distWeb, p)));
    grunt.config.merge({
      copy: {
        jsdev: {
          src: grunt.__gbcCurrentPathes.sources,
          dest: grunt.__gbcCurrentPathes.distWeb
        }
      }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.registerTask("__compilejs", ["copy:jsdev"]);
  } else if (grunt.__gbcCompileMode === "cdev") {
    includes = includes.concat(path.join(grunt.__gbcCurrentPathes.distWeb, "js/gbc.js"));

    grunt.config.merge({
      concat: {
        cdevgbc: {
          options: {
            separator: ";",
            sourceMap: false
          },
          files: [{
            src: grunt.__gbcCurrentPathes.sources,
            dest: path.join(grunt.__gbcCurrentPathes.distWeb, "js/gbc.js")

          }]
        }
      }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.registerTask("__compilejs", ["concat:cdevgbc"]);

  } else if (grunt.__gbcCompileMode === "prod") {
    includes = includes.concat(path.join(grunt.__gbcCurrentPathes.distWeb, "js/gbc.js"));

    var banner =
      `/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
///
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT\n\n`;

    grunt.config.merge({
      uglify: {
        prod: {
          options: {
            banner: banner
          },
          files: [{
            src: grunt.__gbcCurrentPathes.sources,
            dest: path.join(grunt.__gbcCurrentPathes.distWeb, "js/gbc.js")
          }]
        },
        "prod_templates": {
          options: {
            banner: banner
          },
          files: [{
            src: path.join(grunt.__gbcCurrentPathes.distWeb, "js/compiledTemplates.js"),
            dest: path.join(grunt.__gbcCurrentPathes.distWeb, "js/compiledTemplates.js")
          }]
        },
        "prod_locales": {
          options: {
            banner: banner
          },
          files: [{
            src: path.join(grunt.__gbcCurrentPathes.distWeb, "js/compiledLocales.js"),
            dest: path.join(grunt.__gbcCurrentPathes.distWeb, "js/compiledLocales.js")
          }]
        }
      }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("__compilejs", ["uglify:prod", "uglify:prod_templates", "uglify:prod_locales"]);
  }
  grunt.__gbcCurrentPathes.indexIncludes = includes;
};
