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

modulum('ScrollUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ScrollUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.ScrollUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.ScrollUIBehavior.prototype */
      return {
        __name: "ScrollUIBehavior",

        _throttleTimeout: 180,

        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            data.scrollHandle = widget.when(context.constants.widgetEvents.scroll, this._onScroll.bind(this, controller, data));
            data.mousewheelHandle = widget.when(context.constants.widgetEvents.mousewheel, this._onMousewheel.bind(this, controller,
              data));

            data.touchMoveHandle = widget.when(context.constants.widgetEvents.touchmove, this._onTouchMove.bind(this, controller,
              data));
            data.touchStartHandle = widget.when(context.constants.widgetEvents.touchstart, this._onTouchStart.bind(this, controller,
              data));
            data.touchEndHandle = widget.when(context.constants.widgetEvents.touchend, this._onTouchEnd.bind(this, controller,
              data));

          }
          data.requestedOffset = null;
        },

        _detachWidget: function(controller, data) {
          if (data.scrollHandle) {
            data.scrollHandle();
            data.scrollHandle = null;
          }
          if (data.mousewheelHandle) {
            data.mousewheelHandle();
            data.mousewheelHandle = null;
          }
        },

        _onScroll: function(controller, data, e) {
          var widget = controller.getWidget();
          if (!widget.isEnabled()) {
            var event = e.data[0];
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
          } else {
            var scrollTop = e.data[0].target.scrollTop;
            var lineHeight = e.data[1] ? e.data[1] : 1; //prevent division by 0
            var forceOffset = e.data[0].forceOffset; // case of scrollbar widget
            if (forceOffset) {
              data.requestedOffset = forceOffset;
            } else {
              data.requestedOffset = Math.round(scrollTop / lineHeight);
            }
            this._postRequest(controller, data);
          }
        },

        _onMousewheel: function(controller, data, e) {
          var widget = controller.getWidget();
          var event = e.data[0];
          if (!widget.isEnabled()) {
            event.stopImmediatePropagation();
            return false;
          } else {
            event.preventDefault();
            //throttle events...
            if (data.requestedOffset === null) {
              data.requestedOffset = controller.getAnchorNode().attribute("offset");
            }
            var original = data.requestedOffset;
            var delta = (window.browserInfo.isFirefox ? (53 / 3) : 1) * event.deltaY;

            var size = controller.getAnchorNode().attribute("size");
            var pageSize = controller.getAnchorNode().attribute("pageSize");

            data.requestedOffset += Math.round(delta / 16);
            data.requestedOffset = Math.max(0, Math.min(data.requestedOffset, size - pageSize));

            if (original !== data.requestedOffset) {
              this._postRequest(controller, data);
            }
          }
        },

        _onTouchMove: function(controller, data, e) {
          var widget = controller.getWidget();
          var event = e.data[0];
          if (!widget.isEnabled()) {
            event.stopImmediatePropagation();
            return false;
          } else {
            //event.preventDefault();
            //throttle events...
            if (data.requestedOffset === null) {
              data.requestedOffset = controller.getAnchorNode().attribute("offset");
            }
            var original = data.requestedOffset;

            if (this._initialTouchPos && event.touches[0]) {
              var deltaY = event.touches[0].clientY;
              var delta = (window.browserInfo.isFirefox ? (53 / 3) : 1) * deltaY;

              var size = controller.getAnchorNode().attribute("size");
              var pageSize = controller.getAnchorNode().attribute("pageSize");

              var move = this._initialTouchPos.y - delta;
              delta = Math.sign(move) * delta / 8;

              data.requestedOffset += Math.round(delta / 16);
              data.requestedOffset = Math.max(0, Math.min(data.requestedOffset, size - pageSize));

              if (original !== data.requestedOffset) {
                this._postRequest(controller, data);
              }
            }
          }

        },

        _onTouchStart: function(controller, data, e) {
          var event = e.data[0];
          this._initialTouchPos = {
            x: event.touches[0] ? event.touches[0].clientX : 0,
            y: event.touches[0] ? event.touches[0].clientY : 0
          };
        },
        _onTouchEnd: function(controller, data, e) {
          //this._initialTouchPos = {x:0,y:0};
        },

        _postRequest: function(controller, data) {
          if (!data.throttleScroll) {
            data.throttleScroll = window.setTimeout(function(controller, data) {
              //Calculate offset to scroll
              if (data.lastRequestedOffset !== data.requestedOffset) {
                data.lastRequestedOffset = data.requestedOffset;
                this.requestOffset(controller, data, data.requestedOffset);
              }
              data.requestedOffset = null;
              data.throttleScroll = null;
            }.bind(this, controller, data), this._throttleTimeout);
          }
        },

        /**
         * Ask the VM for offset
         * @param offset to move to
         */
        requestOffset: function(controller, data, offset) {
          var event;
          var widget = controller.getWidget();
          if (!!widget) {
            var node = controller.getAnchorNode();
            var app = node.getApplication();
            if (node.attribute("offset") !== offset) {

              if (controller.sendWidgetValue) {
                controller.sendWidgetValue(); // send widget value if necessary
              }

              event = new cls.VMConfigureEvent(node.getId(), {
                offset: offset
              });

              app.event(event);
              widget.setOffset(offset);
              widget.lastSentOffset = offset;
            }
          }
        },
      };
    });
  });
