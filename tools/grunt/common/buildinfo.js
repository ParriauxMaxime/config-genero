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

var fs = require("fs"),
  path = require("path");

module.exports = function(grunt) {
  var locals = null;
  grunt.__gbcOptions = grunt.file.readJSON(path.join(__dirname, "../defaults.json"));
  try {
    var customConfiguration = grunt.option("configuration");
    if (customConfiguration) {
      locals = grunt.file.readJSON(customConfiguration);
    } else {
      locals = grunt.file.readJSON("custom.json");
    }
    grunt.util._.merge(grunt.__gbcOptions, locals);
  } catch (e) {
    //use fallback values
  }

  grunt.__gbcCompileMode = grunt.__gbcOptions.compile.mode;
  grunt.__gbcAntiCache = !grunt.__gbcOptions.compile.noAntiCache ? "t=" + (new Date().getTime()) : "";

  if (grunt.__gbcOptions.compile.customization) {
    if (grunt.__gbcOptions.compile.customization === true) {
      grunt.__gbcOptions.compile.customization = "customization/default";
    }
  }
  if (grunt.option("customization")) {
    grunt.__gbcOptions.compile.customization = grunt.option("customization");
  }
  if (grunt.__gbcOptions.compile.customization === "NONE") {
    grunt.__gbcOptions.compile.customization = null;
  }
  if (!!grunt.__gbcOptions.compile.customization && grunt.__gbcOptions.compile.customization !== "ALL") {
    var customizationDirection = path.join(process.cwd(), grunt.__gbcOptions.compile.customization);
    try {
      fs.accessSync(customizationDirection, fs.R_OK | fs.X_OK);
    } catch (e) {
      console.error(" ");
      console.error("  Customization '" + grunt.__gbcOptions.compile.customization + "' does not exist.");
      console.error(" ");
      throw e;
    }
    var customizationConfig = path.join(process.cwd(), grunt.__gbcOptions.compile.customization, "config.json");
    try {
      fs.accessSync(customizationConfig, fs.R_OK);
      locals = grunt.file.readJSON(customizationConfig);
      grunt.util._.merge(grunt.__gbcOptions, locals);
    } catch (e) {}
  }

  if (grunt.option("build-dist")) {
    grunt.__gbcOptions.compile.buildDist = grunt.option("build-dist");
  }

  var getBuildNumber = function() {
    return grunt.template.date(new Date().getTime(), "yyyymmddHHMM");
  };

  try {
    fs.accessSync(".git", fs.R_OK);
    grunt.config.merge({
      gitinfo: {
        commands: {
          currentVersionTimeStamp: ["log", "--pretty=format:%ct", "-n 1"],
          currentVersionTag: ["name-rev", "--tags", "--name-only", "HEAD"],
          currentVersionChanges: ["diff", "--shortstat"]
        }
      }
    });
    grunt.loadNpmTasks("grunt-gitinfo", "gitinfo");

    getBuildNumber = function() {
      var timestamp = +grunt.config.get("gitinfo.currentVersionTimeStamp");
      return grunt.template.date(timestamp * 1000, "yyyymmddHHMM");
    };
  } catch (e) {
    grunt.registerTask("gitinfo", "", function() {});

  }
  grunt.config.set("gbcinfo.buildnumber", getBuildNumber());
  grunt.registerTask("getbuildnumber", "Get the build number", function() {
    grunt.log.writeln("BUILD=" + getBuildNumber());
  });
  grunt.registerTask("buildnumber", "Returns the current build number in format 'BUILD=<buildnumber>' on the console", ["gitinfo",
    "getbuildnumber"
  ]);
};
