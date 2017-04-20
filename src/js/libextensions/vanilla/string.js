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

// jshint ignore:start
String.prototype.getBytesCount = function() {
  var log = Math.log(256);
  var total = 0;
  for (var i = 0; i < this.length; i++) {
    var charCode = this.charCodeAt(i);
    total += (Math.ceil(Math.log(charCode) / log));
  }
  return total;
};

// Replace char at index
String.prototype.replaceAt = function(index, character) {
  return this.substr(0, index) + character + this.substr(index + character.length);
};
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(pattern) {
    return this.indexOf(pattern) === 0;
  };
}
// jshint ignore:end
