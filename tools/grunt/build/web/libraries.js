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
  if (grunt.__gbcCompileMode === "prod") {
    let files = {
      "jsface.js": "node_modules/jsface/dist/jsface.min.js",
      "mousetrap.js": "node_modules/mousetrap/mousetrap.min.js",
      "mousetrap-global-bind.js": "node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js",
      "moment.js": "node_modules/moment/min/moment-with-locales.min.js",
      "pikaday.js": "node_modules/pikaday-time/pikaday.js",
      "state-machine.js": "node_modules/javascript-state-machine/state-machine.min.js",
      "i18next.js": "node_modules/i18next/i18next.min.js",
      "i18next-browser-languagedetector.js": "node_modules/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js",
      "stackframe.js": "node_modules/stackframe/dist/stackframe.min.js",
      "stacktrace.js": "node_modules/stacktrace-js/dist/stacktrace-with-promises-and-json-polyfills.min.js"
    };
    grunt.util._.merge(files, grunt.__gbcOptions.compile.libraries || {});
    grunt.config.merge({
      concat: {
        clientlibs: {
          src: Object.keys(files).map(key => files[key]),
          dest: path.join(grunt.__gbcCurrentPathes.distWeb, "lib/js/libraries.js")
        }
      }
    });
    grunt.loadNpmTasks("grunt-contrib-concat");

    grunt.registerTask("__libraries", "Copy client libraries to the dist folder.", ["concat:clientlibs"]);

    grunt.__gbcCurrentPathes.libraries = [path.join(grunt.__gbcCurrentPathes.distWeb, "lib/js/libraries.js")];
  } else {
    let files = {
      "jsface.js": "node_modules/jsface/dist/jsface.js",
      "mousetrap.js": "node_modules/mousetrap/mousetrap.js",
      "mousetrap-global-bind.js": "node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.js",
      "moment.js": "node_modules/moment/min/moment-with-locales.js",
      "pikaday.js": "node_modules/pikaday-time/pikaday.js",
      "state-machine.js": "node_modules/javascript-state-machine/state-machine.js",
      "i18next.js": "node_modules/i18next/i18next.js",
      "i18next-browser-languagedetector.js": "node_modules/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.js",
      "stackframe.js": "node_modules/stackframe/dist/stackframe.js",
      "stacktrace.js": "node_modules/stacktrace-js/dist/stacktrace-with-promises-and-json-polyfills.min.js"
    };
    grunt.util._.merge(files, grunt.__gbcOptions.compile.libraries || {});

    grunt.config.merge({
      copy: {
        clientlibs: {
          files: Object.keys(files).map(key => ({
            src: files[key],
            dest: path.join(grunt.__gbcCurrentPathes.distWeb, "lib/js/" + key)
          }))
        }
      }
    });
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.registerTask("__libraries", "Copy client libraries to the dist folder.", ["copy:clientlibs"]);
    grunt.__gbcCurrentPathes.libraries = Object.keys(files).map(key => path.join(grunt.__gbcCurrentPathes.distWeb, "lib/js/" + key));
  }
};
