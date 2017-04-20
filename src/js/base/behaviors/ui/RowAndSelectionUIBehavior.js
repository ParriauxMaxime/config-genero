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

modulum('RowAndSelectionUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RowAndSelectionUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.RowAndSelectionUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.RowAndSelectionUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "RowAndSelectionUIBehavior",

        _attachWidget: function(controller, data) {
          data.lastEvent = null;
          var widget = controller.getWidget();
          if (!!widget) {
            data.downHandle = widget.when(gbc.constants.widgetEvents.keyDown, this._onKeyDown.bind(this, controller, data));
            data.upHandle = widget.when(gbc.constants.widgetEvents.keyUp, this._onKeyUp.bind(this, controller, data));
            data.leftHandle = widget.when(gbc.constants.widgetEvents.keyLeft, this._onKeyLeft.bind(this, controller, data));
            data.rightHandle = widget.when(gbc.constants.widgetEvents.keyRight, this._onKeyRight.bind(this, controller, data));
            data.pageDownHandle = widget.when(gbc.constants.widgetEvents.keyPageDown, this._onKeyPageDown.bind(this, controller,
              data));
            data.pageUpHandle = widget.when(gbc.constants.widgetEvents.keyPageUp, this._onKeyPageUp.bind(this, controller, data));
            data.homeHandle = widget.when(gbc.constants.widgetEvents.keyHome, this._onKeyHome.bind(this, controller, data));
            data.endHandle = widget.when(gbc.constants.widgetEvents.keyEnd, this._onKeyEnd.bind(this, controller, data));
            data.spaceHandle = widget.when(gbc.constants.widgetEvents.keySpace, this._onKeySpace.bind(this, controller, data));
            data.selectAllHandle = widget.when(gbc.constants.widgetEvents.selectAll, this._onSelectAll.bind(this, controller, data));
            data.eventsQueue = [];
          }
        },

        _detachWidget: function(controller, data) {
          if (data.downHandle) {
            data.downHandle();
            data.downHandle = null;
          }
          if (data.upHandle) {
            data.upHandle();
            data.upHandle = null;
          }
          if (data.leftHandle) {
            data.leftHandle();
            data.leftHandle = null;
          }
          if (data.rightHandle) {
            data.rightHandle();
            data.rightHandle = null;
          }
          if (data.pageDownHandle) {
            data.pageDownHandle();
            data.pageDownHandle = null;
          }
          if (data.pageUpHandle) {
            data.pageUpHandle();
            data.pageUpHandle = null;
          }
          if (data.homeHandle) {
            data.homeHandle();
            data.homeHandle = null;
          }
          if (data.endHandle) {
            data.endHandle();
            data.endHandle = null;
          }
          if (data.spaceHandle) {
            data.spaceHandle();
            data.spaceHandle = null;
          }
          if (data.selectAllHandle) {
            data.selectAllHandle();
            data.selectAllHandle = null;
          }
        },

        /**
         * On keyDown widget event
         * @private
         */
        _onKeyDown: function(controller, data, event, sender, domEvent) {
          domEvent.preventDefault();
          var node = controller.getAnchorNode();
          if (node.attribute('multiRowSelection') !== 0) {
            var currentRow = node.attribute('currentRow');
            var sendSelect = !(domEvent.ctrlKey && !domEvent.shiftKey);
            this._sendEvents(controller, data, currentRow + 1, domEvent.ctrlKey, domEvent.shiftKey, sendSelect);
          } else {
            var keyEvent = new cls.VMKeyEvent("Down");
            controller.getAnchorNode().getApplication().event(keyEvent);
          }
        },

        /**
         * On keyUp widget event
         * @private
         */
        _onKeyUp: function(controller, data, event, sender, domEvent) {
          domEvent.preventDefault();
          var node = controller.getAnchorNode();
          if (node.attribute('multiRowSelection') !== 0) {
            var currentRow = node.attribute('currentRow');
            var sendSelect = !(domEvent.ctrlKey && !domEvent.shiftKey);
            this._sendEvents(controller, data, currentRow - 1, domEvent.ctrlKey, domEvent.shiftKey, sendSelect);
          } else {
            var keyEvent = new cls.VMKeyEvent("Up");
            controller.getAnchorNode().getApplication().event(keyEvent);
          }
        },

        /**
         * On keyLeft widget event
         * @private
         */
        _onKeyLeft: function(controller, data, event, sender, domEvent) {
          var widget = controller.getWidget();
          if (widget.hasFocusOnField()) {
            domEvent.preventDefault();
            var keyEvent = new cls.VMKeyEvent("Left");
            controller.getAnchorNode().getApplication().event(keyEvent);
          } else if (!widget.isInputMode()) {
            widget.doHorizontalScroll("left");
          }
        },

        /**
         * On keyRight widget event
         * @private
         */
        _onKeyRight: function(controller, data, event, sender, domEvent) {
          var widget = controller.getWidget();
          if (widget.hasFocusOnField()) {
            domEvent.preventDefault();
            var keyEvent = new cls.VMKeyEvent("Right");
            controller.getAnchorNode().getApplication().event(keyEvent);
          } else if (!widget.isInputMode()) {
            widget.doHorizontalScroll("right");
          }
        },

        /**
         * On keyPageDown widget event
         * @private
         */
        _onKeyPageDown: function(controller, data, event, sender, domEvent) {
          domEvent.preventDefault();
          var node = controller.getAnchorNode();
          var pageSize = node.attribute('pageSize');
          var currentRow = node.attribute('currentRow');
          var sendSelect = !(domEvent.ctrlKey && !domEvent.shiftKey);
          this._sendEvents(controller, data, currentRow + pageSize, domEvent.ctrlKey, domEvent.shiftKey, sendSelect);
        },

        /**
         * On keyPageUp widget event
         * @private
         */
        _onKeyPageUp: function(controller, data, event, sender, domEvent) {
          domEvent.preventDefault();
          var node = controller.getAnchorNode();
          var pageSize = node.attribute('pageSize');
          var currentRow = node.attribute('currentRow');
          var sendSelect = !(domEvent.ctrlKey && !domEvent.shiftKey);
          this._sendEvents(controller, data, currentRow - pageSize, domEvent.ctrlKey, domEvent.shiftKey, sendSelect);
        },

        /**
         * On keyHome widget event
         * @private
         */
        _onKeyHome: function(controller, data, event, sender, domEvent) {
          domEvent.preventDefault();
          var sendSelect = !(domEvent.ctrlKey && !domEvent.shiftKey);
          this._sendEvents(controller, data, 0, domEvent.ctrlKey, domEvent.shiftKey, sendSelect);
        },

        /**
         * On keyEnd widget event
         * @private
         */
        _onKeyEnd: function(controller, data, event, sender, domEvent) {
          domEvent.preventDefault();
          var node = controller.getAnchorNode();
          var size = node.attribute('size');
          var sendSelect = !(domEvent.ctrlKey && !domEvent.shiftKey);
          this._sendEvents(controller, data, size - 1, domEvent.ctrlKey, domEvent.shiftKey, sendSelect);
        },

        /**
         * On keySpace widget event
         * @private
         */
        _onKeySpace: function(controller, data, event, sender, domEvent) {
          domEvent.preventDefault();
          var node = controller.getAnchorNode();
          var currentRow = node.attribute('currentRow');
          this._sendEvents(controller, data, currentRow, domEvent.ctrlKey, domEvent.shiftKey, true);
        },

        /**
         * On selectAll widget event
         * @private
         */
        _onSelectAll: function(controller, data, event, sender, domEvent) {
          var node = controller.getAnchorNode();
          if (node.attribute('multiRowSelection') !== 0) {
            domEvent.preventDefault();
            this._selectAllRows(controller, data);
          }
        },

        /**
         * Creates an configure events and sends them to the VM
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         * @param {number} newCurrentRow new current row value
         * @param {boolean} ctrlKey - true if ctrl key is pressed
         * @param {boolean} shiftKey - true if shift key is pressed
         * @param {boolean} sendSelect - if true row selection event is sent
         */
        _sendEvents: function(controller, data, newCurrentRow, ctrlKey, shiftKey, sendSelect) {
          var node = controller.getAnchorNode();
          var size = node.attribute('size');
          if (newCurrentRow >= size) {
            newCurrentRow = size - 1;
          } else if (newCurrentRow < 0) {
            newCurrentRow = 0;
          }

          var currentRow = node.attribute('currentRow');
          var events = [];

          if (newCurrentRow !== currentRow) {
            var event = new cls.VMConfigureEvent(node.getId(), {
              currentRow: newCurrentRow
            });

            events.push(event);
          }

          if (node.attribute('multiRowSelection') !== 0 && sendSelect) {
            // Row selection event
            events.push(controller.buildRowSelectionEvent(newCurrentRow, ctrlKey, shiftKey));
          }
          // if there are some events send them
          if (events.length > 0) {
            node.getApplication().event(events);
          }
        },

        /**
         *  Send selection row event to select all rows
         */
        _selectAllRows: function(controller, data) {
          var node = controller.getAnchorNode();
          var event = new cls.VMRowSelectionEvent(node.getId(), {
            startIndex: 0,
            endIndex: node.attribute('size') - 1,
            selectionMode: "set"
          });
          node.getApplication().event(event);
        }
      };
    });
  });
