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
  var path = require("path"),
    fs = require("fs");
  grunt.registerMultiTask('__scssJsonToJs', 'Inline *.scss.json files in a single CSS string', function() {
    var variables = {};
    this.files.forEach(function(entry) {
      var imp = entry.src[0];
      try {
        fs.accessSync(entry.src[1], fs.F_OK | fs.R_OK);
        imp = entry.src[1];
      } catch (e) {}
      var data = "{}";
      try {
        var fileContents = fs.readFileSync(imp, {
          encoding: "utf8"
        });
        data = JSON.parse(fileContents);
        if (/theme\.scss\.json$/.test(imp)) {
          data.__import = entry.src[0];
        }
      } catch (e) {
        grunt.log.error("Malformed json file : " + imp);
      }
      var keys = require("../sassImporter")(grunt).jsonToScssKeys(data, path.dirname(imp));
      var code = keys.map(k => '.' + k + '::before { content:"\\""+$' + k + '+"\\""; }').join("\n");
      var fileContent = '@import "__CUSTOMIZATION_SCSS_VARIABLES__";\n@import "__VARIABLES__";\n' + code;
      grunt.file.write(entry.dest, fileContent);
    });
  });
  grunt.registerMultiTask('__cssInlineVarsToJs', 'Inline *.scss.json files in a single JSON object', function() {
    this.files.forEach(function(entry) {
      var content = grunt.file.read(entry.src).toString();
      var re = /\.([^:]+)::before\s*\{\s*content\s*:\s*"([^"]*)";\s*}/gm;
      var match = re.exec(content),
        json = {};
      while (match) {
        var val = match[2];
        json[match[1]] = (val === "true") ? true : ((val === "false") ? false : val);
        match = re.exec(content);
      }
      grunt.file.write(entry.dest, "window.gbc.constants.theme=" + JSON.stringify(json) + ";");
    });
  });

  var index = grunt.__gbcCurrentPathes.sources.indexOf(".cache/scssjson.js");
  if (index > -1) {
    grunt.__gbcCurrentPathes.sources[index] = ".cache/" + grunt.__gbcCurrentPathes.distWebFlat + "/scssjson.js";
  }

  var sassTarget = {};
  sassTarget[".cache/" + grunt.__gbcCurrentPathes.distWebFlat + "/scssjson.css"] = ".cache/" + grunt.__gbcCurrentPathes.distWebFlat +
    "/scssjson.scss";
  grunt.config.merge({
    __scssJsonToJs: {
      files: {
        src: [path.join(process.cwd(), 'src/sass/variables.scss.json'),
          grunt.__gbcCurrentPathes.customizationPath + '/theme.scss.json'
        ],
        dest: ".cache/" + grunt.__gbcCurrentPathes.distWebFlat + "/scssjson.scss"
      }
    },
    sass: {
      inlinevars: {
        options: {
          outputStyle: "compact",
          importer: require("../sassImporter")(grunt).scssJsonImporter
        },
        files: sassTarget
      }
    },
    __cssInlineVarsToJs: {
      files: {
        src: ".cache/" + grunt.__gbcCurrentPathes.distWebFlat + "/scssjson.css",
        dest: ".cache/" + grunt.__gbcCurrentPathes.distWebFlat + "/scssjson.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.registerTask("__theme", ['__scssJsonToJs', 'sass:inlinevars', '__cssInlineVarsToJs']);

};
