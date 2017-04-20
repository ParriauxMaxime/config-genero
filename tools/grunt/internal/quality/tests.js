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

var fs = require('fs'),
  path = require('path'),
  serveStatic = require('serve-static');
module.exports = function(grunt) {
  if (grunt.option("platform")) {
    process.env.TEST_PLATFORM = grunt.option("platform");
  }
  if (grunt.option("browser")) {
    process.env.TEST_BROWSER = grunt.option("browser");
  }
  grunt.config.merge({
    protractor: {
      cutr: {
        options: {
          configFile: "tools/tests/conf/conf-e2e-cutr.js",
          keepAlive: true,
          args: {
            seleniumAddress: (() => {
              if (process.env.TEST_PLATFORM === "android") {
                return "http://localhost:4723/wd/hub";
              }
              if (process.env.TEST_PLATFORM === "ios") {
                return "http://groseille:4723/wd/hub";
              }
              return "http://localhost:4444/wd/hub";
            })(),
            baseUrl: (() => {
              if (process.env.TEST_PLATFORM === "android") {
                return "http://10.0.2.2:9002/";
              }
              if (process.env.TEST_PLATFORM === "ios") {
                return "http://salsa:9002/";
              }
              return "http://localhost:9002/";
            })()
          }
        }
      },
      cat: {
        options: {
          configFile: "tools/tests/conf/conf-e2e-cat.js",
          keepAlive: true,
          args: {
            seleniumAddress: (() => {
              if (process.env.TEST_PLATFORM === "android") {
                return "http://localhost:4723/wd/hub";
              }
              if (process.env.TEST_PLATFORM === "ios") {
                return "http://groseille:4723/wd/hub";
              }
              return "http://localhost:4444/wd/hub";
            })(),
            baseUrl: (() => {
              if (process.env.TEST_PLATFORM === "android") {
                return "http://10.0.2.2:6394";
              }
              if (process.env.TEST_PLATFORM === "ios") {
                return "http://salsa:6399";
              }
              return "http://localhost:6394";
            })()
          }
        }
      },
      perf: {
        options: {
          configFile: "tools/tests/conf/conf-e2e-perf.js",
          keepAlive: true,
          args: {
            seleniumAddress: (() => {
              if (process.env.TEST_PLATFORM === "android") {
                return "http://localhost:4723/wd/hub";
              }
              if (process.env.TESTING_IOS) {
                return "http://groseille:4723/wd/hub";
              }
              return "http://localhost:4444/wd/hub";
            })(),
            baseUrl: (() => {
              if (process.env.TEST_PLATFORM === "android") {
                return "http://10.0.2.2:6394";
              }
              if (process.env.TESTING_IOS) {
                return "http://salsa:6399";
              }
              return "http://localhost:6394";
            })()
          }
        }
      }
    },
    connect: {
      sandbox: {
        options: {
          port: 9002,
          base: 'dist/web',
          livereload: true,
          keepalive: true,
          middleware: function(connect, options, middlewares) {
            middlewares.push(connect().use("/resources", serveStatic('./tools/tests/resources')));
            return middlewares;
          }
        }
      },
      testsrun: {
        options: {
          port: 9002,
          base: 'dist/web',
          middleware: function(connect, options, middlewares) {
            middlewares.push(connect().use("/test_resources", serveStatic('./tools/tests/resources')));
            return middlewares;
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask("tests", ["connect:testsrun", "protractor:cutr"]);
  grunt.registerTask("testcases", ["protractor:cat"]);
  grunt.registerTask("testperfs", ["protractor:perf"]);
};
