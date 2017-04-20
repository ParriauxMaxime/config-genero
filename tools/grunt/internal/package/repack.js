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
  var fs = require("fs"),
    path = require("path");
  grunt.registerMultiTask('repack', 'Repackage package.json', function() {
    var opts = this.options({
      remove: []
    });
    this.files.forEach(function(entry) {
      fs.accessSync(entry.dest, fs.R_OK);
      var pack = JSON.parse(fs.readFileSync("package.json", {
        encoding: "utf8"
      }));
      opts.remove.forEach(item => pack.devDependencies[item] && delete pack.devDependencies[item]);
      fs.writeFileSync(path.join(entry.dest, "package.json"), JSON.stringify(pack, null, 2), {
        encoding: "utf8"
      });
    });
  });
};
