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

/**
 * Return true if mobile browser, false otherwise
 * @returns bool if the browser is mobile
 */
/* jshint ignore:start */
window.isMobile = function() {
  var testExp = new RegExp('Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile|webOS', 'i');
  // window.orientation works well but is deprecated. So we use additional check.
  return (typeof window.orientation !== "undefined") || (testExp.test(navigator.userAgent) === true);
};
/* jshint ignore:end */
window.offset = function(elt) {
  var rect = elt[0].getBoundingClientRect();
  return {
    left: Math.round(rect.left),
    top: Math.round(rect.top),
    centerX: Math.round(rect.left + (rect.width / 2)),
    centerY: Math.round(rect.top + (rect.height / 2))
  };
};
window.screenOffset = function(elt) {
  //TODO: For Firefox, use "window.screenX" and "window.screenY"
  var result = window.offset(elt);
  var topDelta = window.outerHeight - window.innerHeight + window.screenTop;
  var leftDelta = window.screenLeft;
  result.top += topDelta;
  result.centerY += topDelta;
  result.centerX += leftDelta;
  return result;
};

/**
 * Test if a string is a valid URL
 *
 * @returns {Boolean}
 */
window.isValidURL = function(str) {
  var pattern = new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?", "i");
  return !!pattern.test(str);
};

(function(window) {
  window.waitMax = function(timeout, trigger, event, fallback) {
    var time = 0;
    var itv = window.setInterval(function() {
      if (trigger()) {
        window.clearInterval(itv);
        event();
      } else {
        time += 50;
        if (time > timeout) {
          window.clearInterval(itv);
          (fallback || event)();
        }
      }
    }, 50);
  };
})(window);
(function() {
  window.browserInfo = {
    isFirefox: false,
    isEdge: false,
    isIE: false,
    isChrome: false,
    isOpera: false,
    isSafari: false
  };

  var sUsrAg = window.navigator.userAgent;

  if (sUsrAg.indexOf("Edge") > -1) {
    window.browserInfo.isEdge = true;
  } else if (sUsrAg.indexOf("Chrome") > -1) {
    window.browserInfo.isChrome = true;
  } else if (sUsrAg.indexOf("Safari") > -1) {
    window.browserInfo.isSafari = true;
  } else if (sUsrAg.indexOf("Opera") > -1) {
    window.browserInfo.isOpera = true;
  } else if (sUsrAg.indexOf("Firefox") > -1) {
    window.browserInfo.isFirefox = true;
  } else if (sUsrAg.indexOf("MSIE") > -1 || sUsrAg.indexOf("Trident") > -1) {
    window.browserInfo.isIE = true;
  }
})();

// Compute ScrollBar size
(function() {
  var div = document.createElement('div');
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.overflowY = "scroll";
  div.style.position = "absolute";
  div.style.top = "-200px";
  div.style.left = "-200px";
  div.innerHTML = '<div style="height:100px;width:100%"></div>';

  document.body.appendChild(div);
  var w1 = div.offsetWidth;
  var w2 = div.children[0].offsetWidth;
  document.body.removeChild(div);

  window.scrollBarSize = (w1 - w2);
})();
