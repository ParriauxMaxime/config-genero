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
    copy: {
      resources: {
        expand: true,
        cwd: "src/resources",
        src: "**/*",
        dest: path.join(grunt.__gbcCurrentPathes.distWeb, "resources")
      },
      customizationResources: {
        expand: true,
        cwd: grunt.__gbcCurrentPathes.customizationPath + "/resources",
        src: "**/*",
        dest: path.join(grunt.__gbcCurrentPathes.distWeb, "resources")
      },
      customizationFonts: {
        expand: true,
        options: {
          processContent: false
        },
        cwd: grunt.__gbcCurrentPathes.customizationPath + "/fonts",
        src: "**/*",
        dest: path.join(grunt.__gbcCurrentPathes.distWeb, "lib/fonts/")
      },
      droidFonts: {
        options: {
          processContent: false
        },
        files: [{
          expand: true,
          cwd: "node_modules/connect-fonts-droidsans/fonts/default",
          src: ["*.*"],
          dest: path.join(grunt.__gbcCurrentPathes.distWeb, "lib/fonts/")
        }, {
          expand: true,
          cwd: "node_modules/connect-fonts-droidsansmono/fonts/default",
          src: ["*.*"],
          dest: path.join(grunt.__gbcCurrentPathes.distWeb, "lib/fonts/")
        }]
      },
      materialIcons: {
        expand: true,
        options: {
          processContent: false
        },
        cwd: "node_modules/mdi/fonts/",
        src: ["*.*"],
        dest: path.join(grunt.__gbcCurrentPathes.distWeb, "lib/fonts/")
      },
      version: {
        expand: true,
        cwd: "",
        src: "VERSION",
        dest: grunt.__gbcCurrentPathes.distWeb,
        options: {
          process: function(contents, srcPath) {
            return (contents || "").trim() + "-%%BUILD%%";
          }
        }
      },
      productinfo: {
        expand: true,
        cwd: "",
        src: "PRODUCTINFO",
        dest: grunt.__gbcCurrentPathes.distWeb
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.registerTask("__resources", ["copy:version", "copy:productinfo", "copy:droidFonts",
    "copy:materialIcons", "copy:resources", "copy:customizationResources", "copy:customizationFonts"
  ]);

};
