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

module.exports = function(grunt, customizationId) {
  var getDist = function(p, def) {
    if (!p) {
      p = def || "web";
    }
    if (path.isAbsolute(p)) {
      return p;
    } else {
      return "dist/" + p + "/";
    }
  };
  var buildPathes = grunt.__gbcPath = grunt.__gbcPath || {
    distWeb: getDist(grunt.__gbcOptions.compile.buildDist)
  };
  grunt.__gbcPath.distWebFlat = grunt.__gbcPath.distWeb.replace(/\\|\//g, "_");
  if (!!customizationId) {
    grunt.__gbcPathes = grunt.__gbcPathes || {};
    buildPathes = grunt.__gbcPathes[customizationId] = grunt.__gbcPathes[customizationId] || {
      distWeb: getDist(grunt.__gbcOptions.compile.buildDist || customizationId)
    };
    buildPathes.distWebFlat = buildPathes.distWeb.replace(/\\|\//g, "_");
  }

  buildPathes.sources = [
    "src/js/libextensions/**/*.js",
    "src/js/sysinit/gbc.js",
    ".cache/scssjson.js",
    "src/js/sysinit/constants/**/*.js",
    "src/js/base/*.js",
    "src/js/base/events/**/*.js",
    "src/js/base/services/**/*.js",
    "src/js/base/helpers/**/*.js",
    "src/js/base/aui/**/*.js",
    "src/js/base/controller/**/*.js",
    "src/js/base/widget/**/*.js",
    "src/js/base/**/*.js",
    "src/js/plugins/**/*.js"
  ];

  if (!!customizationId) {
    buildPathes.customizationPath = path.normalize(path.join(process.cwd(), customizationId));
    buildPathes.sources.push(buildPathes.customizationPath + "/js/**/*.js");
  }
  buildPathes.sources.push("src/js/sysinit/gbcStart.js");

  buildPathes.templates = ["src/js/**/*.tpl.html"];
  if (!!customizationId) {
    buildPathes.templates.push(buildPathes.customizationPath + "/js/**/*.tpl.html");
  }

  buildPathes.locales = ["src/locales/**/*.json"];
  if (!!customizationId) {
    buildPathes.locales.push(buildPathes.customizationPath + "/locales/**/*.json");
  }

  return buildPathes;
};
