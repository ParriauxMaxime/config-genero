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
  var path = require("path");
  var fs = require("fs");
  var copyrightIgnores = [
    "node_modules", "resources/webcomponents/fglrichtext", "tools/tests/Platform/tmp"
  ].map(p => new RegExp(p.replace(/\//g, "\\" + path.sep)));
  var copyrightPathTest = function(filepath) {
    for (let re of copyrightIgnores) {
      if (re.test(filepath)) {
        return false;
      }
    }
    return true;
  };
  var getCopyright = function(d, t) {
    var to = new Date().getYear() + 1900,
      from = d || to;
    var result = "FOURJS_START_COPYRIGHT(" + (t || "D") + "," + from + `)
Property of Four Js*
(c) Copyright Four Js ` + from + ", " +
      to + `. All Rights Reserved.
* Trademark of Four Js Development Tools Europe Ltd
  in the United States and elsewhere` + "\n\n";
    if (t === "U") {
      result +=
        `Four Js and its suppliers do not warrant or guarantee that these samples
are accurate and suitable for your purposes. Their inclusion is purely for
information purposes only.
FOURJS_END_COPYRIGHT`;
    } else {
      result += `This file can be modified by licensees according to the
product manual.
FOURJS_END_COPYRIGHT`;
    }
    return result;
  };

  grunt.registerMultiTask('check_copyrights', 'Check copyrights', function() {
    this.files.forEach(function(files) {
      var year = (new Date()).getUTCFullYear();
      var pattern = files.model.replace(/XXXX/g, "2014").replace(/YYYY/g, year);
      files.src.map(function(file) {
        var contents = fs.readFileSync(file, "utf8"),
          index = contents.indexOf(pattern);
        if (index < 990) {
          grunt.log.error("Copyright not found in " + file);
          return false;
        }
      });
    });
  });

  grunt.config.merge({
    usebanner: {
      copyrightjs: {
        options: {
          position: "top",
          linebreak: false,
          replace: function(contents, newBanner, insertMark, file) {
            if (contents.indexOf("/// FOURJS_EXTERNAL") === 0) {
              return contents;
            }
            var start = "/// FOURJS_START_COPYRIGHT",
              end = "/// FOURJS_END_COPYRIGHT\n",
              re = new RegExp(start + "\\(D,([0-9]+)\\)\n").exec(contents),
              reU = new RegExp(start + "\\(U,([0-9]+)\\)\n").exec(contents),
              idx = contents.indexOf(start),
              lidx = contents.indexOf(end),
              result = "";
            if (reU) {
              result = "/// " + getCopyright(reU[1], "U").replace(/\n/g, "\n/// ") + "\n" + contents.slice(lidx + end.length);
            }
            if (re) {
              result = "/// " + getCopyright(re[1]).replace(/\n/g, "\n/// ") + "\n" + contents.slice(lidx + end.length);
            } else {
              console.log("Added copyright for", file);
              result = "/// " + getCopyright().replace(/\n/g, "\n/// ") + "\n\n" + contents;
            }
            return result; //.replace(/\/\/\/\s+\n/g, "///\n");
          }
        },
        src: ["src/**/*.js", "tools/**/*.js", "customization/**/*.js", "tests/**/*.js"],
        filter: copyrightPathTest
      },
      copyrighttplhtml: {
        options: {
          position: "top",
          linebreak: false,
          replace: function(contents, newBanner, insertMark, file) {
            if (contents.indexOf("<!--\n FOURJS_EXTERNAL") === 0) {
              return contents;
            }
            var start = "<!--\n FOURJS_START_COPYRIGHT",
              end = " FOURJS_END_COPYRIGHT\n-->",
              re = new RegExp(start + "\\(D,([0-9]+)\\)\n").exec(contents),
              reU = new RegExp(start + "\\(U,([0-9]+)\\)\n").exec(contents),
              idx = contents.indexOf(start),
              lidx = contents.indexOf(end);
            if (reU) {
              return "<!--\n " + getCopyright(reU[1], "U").replace(/\n/g, "\n ") + "\n-->" + contents.slice(lidx + end.length);
            }
            if (re) {
              return "<!--\n " + getCopyright(re[1]).replace(/\n/g, "\n ") + "\n-->" + contents.slice(lidx + end.length);
            } else {
              console.log("Added copyright for", file);
              return "<!--\n " + getCopyright().replace(/\n/g, "\n ") + "\n-->\n" + contents;
            }
          }
        },
        src: ["src/**/*.tpl.html", "tools/**/*.tpl.html", "customization/**/*.tpl.html", "tests/**/*.tpl.html"],
        filter: copyrightPathTest
      }
    },
    "check_copyrights": {
      distweb: {
        files: [{
          src: "dist/web/css/**/*.css",
          model: `/*
 * FOURJS_START_COPYRIGHT(D,XXXX)
 * Property of Four Js*
 * (c) Copyright Four Js XXXX, YYYY. All Rights Reserved.
 * * Trademark of Four Js Development Tools Europe Ltd
 *   in the United States and elsewhere
 * 
 * This file can be modified by licensees according to the
 * product manual.
 * FOURJS_END_COPYRIGHT
 */`
        }, {
          src: "dist/web/js/**/*.js",
          model: `/// FOURJS_START_COPYRIGHT(D,XXXX)
/// Property of Four Js*
/// (c) Copyright Four Js XXXX, YYYY. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
///
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT`
        }, {
          src: "dist/web//*.html",
          model: `<!--
   FOURJS_START_COPYRIGHT(D,XXXX)
   Property of Four Js*
   (c) Copyright Four Js XXXX, YYYY. All Rights Reserved.
   * Trademark of Four Js Development Tools Europe Ltd
     in the United States and elsewhere

   This file can be modified by licensees according to the
   product manual.
   FOURJS_END_COPYRIGHT
 -->`
        }]
      }
    }
  });
  grunt.loadNpmTasks("grunt-banner");

  grunt.registerTask("checkcopyright", ["check_copyrights:distweb"]);
  grunt.registerTask("copyright", ["usebanner:copyrightjs", "usebanner:copyrighttplhtml"]);
};
