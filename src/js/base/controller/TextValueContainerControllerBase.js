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

modulum('TextValueContainerControllerBase', ['ValueContainerControllerBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base controller for an AUI node.
     * Manages client side life cycle representation of the node.
     * @class classes.TextValueContainerControllerBase
     * @extends classes.ValueContainerControllerBase
     */
    cls.TextValueContainerControllerBase = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      /** @lends classes.TextValueContainerControllerBase.prototype */
      return {
        __name: "TextValueContainerControllerBase",

        typeahead: function(keys) {
          var widget = this.getWidget();
          var consumed = true;
          var i = 0;
          if (widget.getCursors) {
            var cursors = widget.getCursors();
            var value = widget.getValue().toString();
            for (i = 0; consumed && i < keys.length; ++i) {
              var key = keys[i];
              consumed = false;
              if (key === 'space') {
                key = ' ';
              }
              if (key.length === 1) {
                var firstPart = value.substr(0, cursors.start);
                var secondPart = value.substr(cursors.end);
                value = firstPart + key;
                var newCursorPos = value.length;
                value += secondPart;
                cursors.start = cursors.end = newCursorPos;
                consumed = true;
              } else switch (key) {
                case widget.getStart():
                  cursors.start = cursors.start > 0 ? cursors.start - 1 : 0;
                  cursors.end = cursors.start;
                  consumed = true;
                  break;
                case widget.getEnd():
                  cursors.start = cursors.end < value.length ? cursors.end + 1 : value.length;
                  cursors.end = cursors.start;
                  consumed = true;
                  break;
                case 'home':
                  cursors.start = cursors.end = 0;
                  consumed = true;
                  break;
                case 'end':
                  cursors.start = cursors.end = value.length;
                  consumed = true;
                  break;
                case 'shift+' + widget.getStart():
                  cursors.start = cursors.start > 0 ? cursors.start - 1 : 0;
                  consumed = true;
                  break;
                case 'shift+' + widget.getEnd():
                  cursors.end = cursors.end < value.length ? cursors.end + 1 : value.length;
                  consumed = true;
                  break;
                case 'ctrl+a':
                  cursors.start = 0;
                  cursors.end = value.length;
                  consumed = true;
                  break;
                case 'backspace':
                  if (cursors.end > 0 && value) {
                    if (cursors.start === cursors.end) {
                      value = value.slice(0, cursors.start - 1) + value.slice(cursors.start);
                      cursors.start = cursors.end = cursors.end - 1;
                    } else {
                      value = value.slice(0, cursors.start) + value.slice(cursors.end);
                    }
                  }
                  consumed = true;
                  break;
                case 'del':
                  if (cursors.end > -1 && value) {
                    if (cursors.start === cursors.end) {
                      value = value.slice(0, cursors.start) + value.slice(cursors.start + 1);
                    } else {
                      value = value.slice(0, cursors.start) + value.slice(cursors.end);
                    }
                  }
                  consumed = true;
                  break;
              }
            }

            if (!widget.isReadOnly()) { // notEditable widgets can get focus but are readonly
              widget.setValue(value, true);
              widget.setCursors(cursors.start, cursors.end);
              if (widget.hasCompleter && widget.hasCompleter()) {
                widget.emit(context.constants.widgetEvents.change, null, true);
              }
            }
          }

          return $super.typeahead.call(this, consumed ? keys.slice(i) : keys.slice(i - 1));
        }
      };
    });
  });
