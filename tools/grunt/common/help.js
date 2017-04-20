/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

module.exports = function(grunt) {
  grunt.registerTask("help", "show available commands", function() {
    console.log("#########################");
    console.log("# Available grunt tasks #");
    console.log("#########################");
    console.log("");
    console.log("grunt [default] [--customization=NONE] [--build-dist=<build-dist>] [--create-zip]");
    console.log("    compiles the default GBC without customization in 'dist/web'");
    console.log("    if --create-zip is defined, creates a runtime zip in archive/");
    console.log("");
    console.log("grunt --customization=<customizationId> [--build-dist=<build-dist>] [--create-zip]");
    console.log("    compiles GBC with the given customization in 'dist/<customizationId>' or 'dist/<build-dist>' if defined");
    console.log("    if --create-zip is defined, creates a runtime zip in archive/");
    console.log("");
    console.log("grunt --customization=ALL [--create-zip]");
    console.log("    compiles GBC without customization in 'dist/web' and every customization in 'customization/' folder");
    console.log("    if --create-zip is defined, creates a runtime zip in archive/ for each customization");
    console.log("");
    console.log("grunt clean");
    console.log("    erases the .cache/, dist/, archive/ folders");
    console.log("");
    console.log("grunt cleanall");
    console.log("    erases the .cache/, dist/, archive/, node_modules/ folders");
    console.log("");
    console.log("grunt dev [--customization=<customizationId>]");
    console.log("    compiles GBC (possibly with given customization) and live watches for source changes");
    console.log("");
    console.log("grunt help");
    console.log("    displays this present help");
    console.log("");
    console.log("######################### internal tasks only");
    console.log("");
    console.log("grunt codecheck");
    console.log("    runs jsbeautifier and jshint against sources");
    console.log("");
    console.log("grunt githooks");
    console.log("    installs/updates git precommit hook");
    console.log("");
    console.log("grunt package");
    console.log("    generates public source package");
    console.log("");
    console.log("grunt testcases");
    console.log("    runs application tests");
    console.log("");
    console.log("grunt tests");
    console.log("    runs unit tests");
    console.log("");
    console.log("grunt xcfdeploy [--filter=<filter>]");
    console.log("    deploys test cases on GAS (via Environment variables) potentially filtered on pathes by *filter*");
    console.log("");
    console.log("grunt todo");
    console.log("    displays TODOs in sources code");
    console.log("");

  });
};
