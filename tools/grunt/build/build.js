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
  require("../common/buildinfo")(grunt);
  var pathes = require("./pathes")(grunt, grunt.__gbcOptions.compile.customization !== "NONE" && grunt.__gbcOptions.compile.customization);
  grunt.__gbcCurrentPathes = pathes;

  require("./web/resources")(grunt);
  require("./web/templates")(grunt);
  require("./web/locales")(grunt);
  require("./web/libraries")(grunt);
  require("./web/stylesheets")(grunt);
  require("./web/theme")(grunt);
  require("./web/compilejs")(grunt);
  require("./web/html")(grunt);
  require("./web/injection")(grunt);
  require("./makeGz")(grunt);
  require("./zipArchive")(grunt);

  var dependencies = [
    "__resources", "__templates", "__locales", "__libraries", "__stylesheets", "__theme", "__compilejs",
    "__html", "__injection"
  ];
  if (grunt.option("create-zip")) {
    dependencies.push("__makeGz", "__archive");
  }
  grunt.registerTask("__compile", dependencies);
};
