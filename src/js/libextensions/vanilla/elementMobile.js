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
(function() {

  /**
   * Handle double tap events
   * @param {String} context gives a namespace to the event
   * @param {Function=} callback
   */
  Element.prototype.onDoubleTap = function(context, callback) {
    var lastTap = 0;
    this.on('touchend.doubleTap_' + context, function(event) {
      var currentTime = new Date().getTime();
      var tapLength = currentTime - lastTap;
      if (tapLength < 500 && tapLength > 0) {
        // Double Tapped
        callback(event);
        event.preventDefault();
      }
      lastTap = currentTime;
    });
  };

  /**
   * Unregister doubleTap event
   * @param {String} context : namespace of the event to unregister
   */
  Element.prototype.offDoubleTap = function(context) {
    this.off("touchend.doubleTap_" + context);
  };

  /**
   * Handle swipe events
   * @param {String} context gives a namespace to the event
   * @param {Function=} callback with swiped direction and distance as arguments
   * @param {Object} options
   *    direction : gives a direction to listen to: [left, right, up, down, all]
   *    debounce : true/false to limit the touchmove call
   *    swipeEnd : true/false to call callback once touch end
   */
  Element.prototype.onSwipe = function(context, callback, options) {
    options = (typeof options === "object") ? options : {};

    var direction = options.direction ? options.direction : "all";

    var watchDirection = {
      left: direction === "left" || direction === "all",
      right: direction === "right" || direction === "all",
      up: direction === "up" || direction === "all",
      down: direction === "down" || direction === "all"
    };

    var lastTouchMoveEvent = null;

    var _touchStartX = null;
    var _touchStartY = null;

    var _applyCallback = function(evt) {
      if (!_touchStartX || !_touchStartY || !evt) {
        return;
      }
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = _touchStartX - xUp;
      var yDiff = _touchStartY - yUp;

      // Get most significant direction
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          /* left swipe */
          if (watchDirection.left) {
            callback("left", yDiff);
          }
        } else {
          if (watchDirection.right) {
            callback("right", yDiff);
          }
        }
      } else {
        if (yDiff > 0) {
          if (watchDirection.up) {
            callback("up", xDiff);
          }
        } else {
          if (watchDirection.down) {
            callback("down", xDiff);
          }
        }
      }
      /* reset values */
      _touchStartX = null;
      _touchStartY = null;
    };

    var _onTouchStart = function(evt) {
      _touchStartX = evt.touches[0].clientX;
      _touchStartY = evt.touches[0].clientY;
    };

    var _onTouchEnd = function(evt) {
      if (options.swipeEnd) {
        _applyCallback(lastTouchMoveEvent);
      }
    };
    var _onTouchMove = function(evt) {
      lastTouchMoveEvent = evt;
      if (!options.swipeEnd) {
        _applyCallback(evt);
      }
    };

    if (options.debounce) {
      this.on('touchmove.swipe_' + direction + '_' + context, _onTouchMove.debounce().bind(this));
      this.on('touchstart.swipe_' + direction + '_' + context, _onTouchStart.debounce().bind(this));
      this.on('touchend.swipe_' + direction + '_' + context, _onTouchEnd.debounce().bind(this));
    } else {
      this.on('touchstart.swipe_' + direction + '_' + context, _onTouchStart.bind(this));
      this.on('touchend.swipe_' + direction + '_' + context, _onTouchEnd.bind(this));
      this.on('touchmove.swipe_' + direction + '_' + context, _onTouchMove.bind(this));
    }
  };

  /**
   * Unregister swipe event
   * @param {String} context : namespace of the event to unregister
   * @param {String} direction : remove swipe direction
   */
  Element.prototype.offSwipe = function(context, direction) {
    direction = direction ? direction : "all";
    this.off('touchstart.swipe_' + direction + '_' + context);
    this.off('touchend.swipe_' + direction + '_' + context);
    this.off('touchmove.swipe_' + direction + '_' + context);
  };

  /**
   * Handle long touch events
   * @param {String} context gives a namespace to the event
   * @param {Function=} callback
   * @param {Object} options
   *    touchDuration : define the duration before triggering the callback
   */
  Element.prototype.onLongTouch = function(context, callback, options) {
    var touchDuration = (options && options.touchDuration) || 500;
    var preventDefault = (options && options.preventDefault) || true;
    var timer = null;

    this.on('touchstart.longTouch_' + context, function(event) {
      if (preventDefault) {
        event.preventDefault();
      }
      timer = setTimeout(function() {
        callback(event);
      }.bind(this), touchDuration);
    });

    this.on('touchend.longTouch_' + context, function() {
      if (timer) {
        clearTimeout(timer);
      }
    });
  };

  /**
   * Unregister longTouch event
   * @param {String} context : namespace of the event to unregister
   */
  Element.prototype.offLongTouch = function(context) {
    this.off("touchstart.longTouch_" + context);
    this.off("touchend.longTouch_" + context);
  };

})();
