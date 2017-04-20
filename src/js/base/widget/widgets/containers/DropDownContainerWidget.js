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

modulum('DropDownContainerWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * DropDown widget.
     * @class classes.DropDownContainerWidget
     * @extends classes.WidgetGroupBase
     */
    cls.DropDownContainerWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.DropDownContainerWidget.prototype */
      return {
        __name: "DropDownContainerWidget",
        __templateName: "DropDownWidget",
        _defaultMinWidth: 80,
        _defaultMaxHeight: 300,

        /*
         _initLayout: function() {
         $super._initLayout.call(this);
         this._layoutEngine = new cls.LeafLayoutEngine(this);
         },
         */

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
        },

        getCurrentDropDown: function() {
          return this._children[0];
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         * @param {classes.WidgetBase} options.parent - dropdown associated with a parent dropdown
         * @param {boolean=} options.noDOMInsert - won't add child to DOM
         * @param {number=} options.position - insert position
         */
        addChildWidget: function(widget, options) {
          options = options || {};
          if (!options.parent) {
            this.empty();
          }
          var position = Object.isNumber(options.position) ? options.position : (this._children.length);
          if (!options.noDOMInsert) {
            this._addChildWidgetToDom(widget, position);
          }
          this._children.splice(position, 0, widget);
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        removeChildWidget: function(widget) {
          //widget.unbindBlur();
          widget.emit(context.constants.widgetEvents.close);
          this._removeChildWidgetFromDom(widget);
          this._children.remove(widget);
          //widget.destroy();
        },

        empty: function() {
          var widget = this.getCurrentDropDown();
          if (widget) {
            var parent = widget.getParentWidget();
            if (parent) {
              this.show(parent, widget, false);
            }
          }
          $super.empty.call(this);
        },

        /**
         * Set position & size of dropdown container
         * @param {classes.DropDownWidget} parent
         * @param {*} widget
         */
        setPosition: function(parent, widget) {
          var isReversed = parent.isReversed();
          var rect = parent.getElement().getBoundingClientRect();
          var placeTop = null;
          var placeLeft = null;
          var maxHeight = this._defaultMaxHeight;

          // get screen dimensions to detect if dropdown has enough space to be displayed at its default position (right under the widget)
          var minWidth = Math.max((widget.width ? widget.width : rect.width), this._defaultMinWidth);
          // take min between sum of dropdown height + bound field height and max allowed height (300px)
          if (widget.maxHeight) { // if widget specify its own max height, we take it (cf DATEEDIT and DATETIMEEDIT)
            maxHeight = rect.height + widget.maxHeight;
          } else {
            maxHeight = Math.min((this._element.scrollHeight + rect.height), this._defaultMaxHeight);
          }

          var docHeight = document.body.offsetHeight;
          var docWidth = document.body.clientWidth;

          var elemHeight = rect.height + 1;
          // by default, position dropdown using top left attribute and right under parent element
          var top = rect.top + document.body.scrollTop;
          var left = rect.left + document.body.scrollLeft;
          // if alignToLeft is false, we horizontally align dropdown with cursor position
          if (widget.alignToLeft === false && !isReversed && window.event && window.event.clientX) { // TO IMPROVE BECAUSE OF FF
            left = window.event.clientX;
          }

          // if x and y are set in the widget, we use them instead of relative parent element
          if (widget.y) {
            top = widget.y;
            if (widget.y === "CENTER") {
              placeTop = true;
              top = (window.innerHeight / 2);
            }
          }
          if (widget.x) {
            left = widget.x;
            if (widget.x === "CENTER") {
              placeLeft = true;
              left = (window.innerWidth / 2);
            }
          } else {
            // We are going to place dropdown relative toward element
            // We need to detect if element bound to dropdown is in a container having horizontal scrollbars and is itself partially overflowed
            // If so, we reduce dropdown width to fetch screen width
            var currentWindow = context.HostService.getCurrentWindow();
            if (currentWindow) {
              var sidebarWidth = currentWindow.getSidebarWidget().getSidebar().getCurrentSize();
              // get widgets area width
              var contentRect = currentWindow.getWindowContent().getBoundingClientRect();
              if (minWidth + left - sidebarWidth > contentRect.width) {
                // take screen width and remove sidebar + menu widths
                var menuRightWidth = currentWindow.getWindowMenuContainerRight().getBoundingClientRect();
                var newMinWidth = docWidth - left - menuRightWidth.width;
                minWidth = Math.max(newMinWidth, this._defaultMinWidth);
              }
            }
          }

          // Calculate remaining horizontal and vertical space
          if (placeTop === null) {
            placeTop = docHeight - top >= maxHeight;
          }
          if (placeLeft === null) {
            placeLeft = docWidth - left >= minWidth;
          }

          // invert position in case of insufficient remaining space
          if (isReversed) { // REVERSE mode (arabic) special case
            this.addClass("reverse");
            left = docWidth - rect.right - document.body.scrollLeft;
            placeLeft = false;
          } else if (!placeLeft) {
            if (left < minWidth) { // crappy small screen detected
              placeLeft = true;
            } else {
              left = docWidth - left;
            }
          }
          if (!placeTop) {
            if (top < maxHeight) { // crappy small screen detected
              top = 0;
              placeTop = true;
            } else {
              top = docHeight - top;
            }
          } else {
            if (!widget.y) { // position right under parent
              top += elemHeight;
              if (this.getParentWidget()) { // sub dropdown
                top -= elemHeight;
              }
              top = Math.max(0, top);
            }
            if (!widget.x && this.getParentWidget()) { // sub dropdown
              left += minWidth;
            }
          }

          // Create absolute positions
          var cssPos = {};
          cssPos.left = placeLeft ? left + "px" : "auto";
          cssPos.right = placeLeft ? "auto" : left + "px";
          cssPos.top = placeTop ? top + "px" : "auto";
          cssPos.bottom = placeTop ? "auto" : top + "px";

          // Create width
          if (widget.autoSize === true) {
            cssPos["min-width"] = cssPos["max-width"] = minWidth + "px";
            if (maxHeight === this._defaultMaxHeight) {
              cssPos["max-height"] = this._defaultMaxHeight + "px";
            }
          } else {
            cssPos["min-width"] = "unset";
            cssPos["max-width"] = "unset";
            cssPos["max-height"] = (docHeight - top - 5) + "px";
          }

          this.setStyle(cssPos);
        },

        /**
         * @param {classes.WidgetBase} parent
         * @param {classes.DropDownWidget} widget
         * @param {boolean} visible
         */
        show: function(parent, widget, visible) {
          this._element.toggleClass("hidden", !visible)
            .toggleClass("dd_" + parent.getName(), !!visible);

          if (visible) {
            this.setPosition(parent, widget);
          }
        }
      };
    });
    cls.WidgetFactory.register('DropDownContainer', cls.DropDownContainerWidget);
  });
