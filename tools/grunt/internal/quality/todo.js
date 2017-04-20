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
  grunt.config.merge({
    todo: {
      options: {
        marks: [{
          name: "FIX",
          pattern: /FIXME/,
          color: "red"
        }, {
          name: "TODO",
          pattern: /TODO/,
          color: "yellow"
        }, {
          name: "NOTE",
          pattern: /NOTE/,
          color: "blue"
        }],
        title: "Project Todo List"
      },
      src: ["src/**/*"]
    }
  });
  grunt.loadNpmTasks("grunt-todo");
};
