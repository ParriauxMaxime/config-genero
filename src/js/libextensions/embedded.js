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
(function(window) {
  var embedded = {
    nwjs: !!(typeof(process) === "object" && process.features && process.features.uv),
    phonegap: (document.location.protocol === "file:")
  };
  embedded.any = embedded.nwjs || embedded.phonegap;

  window.embeddedInfo = embedded;
})(window);
