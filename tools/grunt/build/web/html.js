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
  grunt.config.merge({
    injector: {
      index: {
        options: {
          template: "src/index.html",
          relative: !path.isAbsolute(grunt.__gbcOptions.compile.buildDist || "."),
          transform: function(filepath) {
            var e = filepath.split(".").slice(-1)[0];
            var f = filepath.replace("../../", "").replace(path.join(grunt.__gbcCurrentPathes.distWeb, "/"), "") + "?$CACHE";
            if (e === "css") {
              return "<link rel=\"stylesheet\" href=\"" + f + "\">";
            } else if (e === "js") {
              return "<script src=\"" + f + "\"></script>";
            } else if (e === "html") {
              return "<link rel=\"import\" href=\"" + f + "\">";
            }
          }
        },
        files: [{
          dest: path.join(grunt.__gbcCurrentPathes.distWeb, "/index.html"),
          src: grunt.__gbcCurrentPathes.indexIncludes || []
        }]
      },
      bootstrap: {
        options: {
          template: "src/index.html",
          relative: !path.isAbsolute(grunt.__gbcOptions.compile.buildDist || "."),
          transform: function(filepath) {
            var e = filepath.split(".").slice(-1)[0];
            var f = filepath.replace("../../", "").replace(path.join(grunt.__gbcCurrentPathes.distWeb, "/"), "") + "?$CACHE";
            if (e === "css") {
              return "<link rel=\"stylesheet\" href=\"" + f + "\">";
            } else if (e === "js") {
              return "<script src=\"" + f + "\"></script>";
            } else if (e === "html") {
              return "<link rel=\"import\" href=\"" + f + "\">";
            }
          }
        },
        files: [{
          dest: path.join(grunt.__gbcCurrentPathes.distWeb, "/bootstrap.html"),
          src: grunt.__gbcCurrentPathes.indexIncludes || []
        }]
      }
    },
    replace: {
      index: {
        src: [path.join(grunt.__gbcCurrentPathes.distWeb, "/index.html")],
        overwrite: true,
        replacements: [{
          from: "<!-- Bootstrap information -->",
          to: ""
        }, {
          from: "$CACHE",
          to: grunt.__gbcAntiCache
        }]
      },
      bootstrap: {
        src: [path.join(grunt.__gbcCurrentPathes.distWeb, "/bootstrap.html")],
        overwrite: true,
        replacements: [{
          from: "<!-- Bootstrap information -->",
          to: function() {
            return grunt.file.read("src/bootstrapParams.tpl");
          }
        }, {
          from: "$CACHE",
          to: grunt.__gbcAntiCache
        }]
      }
    }
  });

  grunt.loadNpmTasks("grunt-injector");
  grunt.loadNpmTasks("grunt-text-replace");

  grunt.registerTask("__html", ["injector:index", "injector:bootstrap", "replace:index", "replace:bootstrap"]);
};
