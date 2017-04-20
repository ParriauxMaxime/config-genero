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
  var local = require("../common/init")(grunt);
  require("../common/syschecks")(grunt);
  if (local.taskmatch(/^clean\w*$/)) {
    require("../common/clean")(grunt);
  }
  if (local.taskmatch(/^package$/)) {
    require("./package/package")(grunt);
  }
  if (local.taskmatch(/^buildnumber$/)) {
    require("../common/buildinfo")(grunt);
  }
  if (local.taskmatch(/^xcfdeploy$/)) {
    require("./quality/xcfDeploy")(grunt);
  }
  if (local.taskmatch(/^test.*$/)) {
    require("./quality/tests")(grunt);
  }
  if (local.taskmatch(/^copyright$/) || local.taskmatch(/^checkcopyright$/)) {
    require("./quality/copyright")(grunt);
  }
  if (local.taskmatch(/^githooks$/) || local.taskmatch(/^githooksPreCommit$/) || local.taskmatch(/^dirtyCheck$/)) {
    require("./quality/githooks")(grunt);
  }

  if (local.taskmatch(/^(git)?codecheck$/)) {
    require("./quality/codecheck")(grunt);
  }
  if (local.taskmatch(/^dev$/) || local.taskmatch(/^watch:\w*$/)) {
    require("../build/watch")(grunt);
  }

  if (local.taskmatch(/^help$/)) {
    require("../common/help")(grunt);
  }
  if (local.taskmatch(/^todo$/)) {
    require("../internal/quality/todo")(grunt);
  }
  if (local.taskmatch(/^(compile\w*)|(default)$/) || local.taskmatch()) {
    require("../common/buildinfo")(grunt);
    if (grunt.__gbcOptions.compile.customization === "ALL") {
      require("../build/buildall")(grunt);
      grunt.registerTask("default", "Compile GBC.", ["__compileall"]);
    } else {
      require("../build/build")(grunt);
      grunt.registerTask("default", "Compile GBC.", ["__compile"]);
    }
  } else {
    grunt.registerTask("default", "Compile GBC.", []);
  }
};
