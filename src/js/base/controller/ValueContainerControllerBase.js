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

modulum('ValueContainerControllerBase', ['ControllerBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base controller for an AUI node.
     * Manages client side life cycle representation of the node.
     * @class classes.ValueContainerControllerBase
     * @extends classes.ControllerBase
     */
    cls.ValueContainerControllerBase = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.ValueContainerControllerBase.prototype */
      return {
        __name: "ValueContainerControllerBase",

        isInTable: false,
        isInFirstTableRow: false,
        isInMatrix: false,
        ignoreTypeahead: false,

        /**
         * @constructs {classes.ValueContainerControllerBase}
         * @param {ControllerBindings} bindings
         */
        constructor: function(bindings) {
          this.isInTable = bindings.container && bindings.container.getTag() === "TableColumn";
          if (this.isInTable) {
            var valueIndex = bindings.anchor.getParentNode().getChildren().indexOf(bindings.anchor);
            this.isInFirstTableRow = (valueIndex === 0);
          }
          this.isInMatrix = bindings.container && bindings.container.getTag() === "Matrix";

          $super.constructor.call(this, bindings);
        },
        /**
         * Creates a new widget depending on the dialog type
         * @returns {classes.WidgetBase}
         */
        createWidget: function() {
          if (!this._widget && this.shouldCreateWidget()) {
            var dialogType = null;

            // Determine the widget kind of a valueNode
            if (this.getAnchorNode()) {
              dialogType = this.getAnchorNode().attribute('dialogType');
            }
            if (!dialogType && this.getNodeBindings().decorator) {
              dialogType = this.getNodeBindings().decorator.attribute('dialogType');
            }
            if (!dialogType && this.getNodeBindings().container) {
              dialogType = this.getNodeBindings().container.attribute('dialogType');
            }

            var type = this._getWidgetType(dialogType);
            this._widgetKind = dialogType;
            this._widgetType = type;

            this._widget = this._createWidget(type);
          }
          return this._widget;
        },

        /**
         *
         * @param {string=} kind
         * @returns {classes.WidgetBase}
         * @protected
         * @virtual
         */
        _createWidget: function(type) {
          return cls.WidgetFactory.create(type, this.getNodeBindings().decorator.attribute('style'), {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            auiTag: this.getAnchorNode().getId(),
            inTable: this.isInTable,
            inFirstTableRow: this.isInFirstTableRow,
            inMatrix: this.isInMatrix
          });
        },

        /**
         * Check if the widget should be created.
         */
        shouldCreateWidget: function() {

          if (this.isInTable) { // In table if the value index is greater than table size, it's not necessary to create a widget (optim)
            var tableNode = this.getNodeBindings().container.getParentNode();
            if (tableNode.attribute("offset") > 0) {
              return true;
            }

            var tableSize = tableNode.attribute("size");
            var valueIndex = this.getAnchorNode().getParentNode().getChildren().indexOf(this.getAnchorNode());

            if (valueIndex >= tableSize) {
              return (tableSize === 0 && valueIndex === 0);
            }
          }

          return true;
        },

        /**
         * Strategy method which returns widget value in VM ready format
         * @param widget
         * @returns {string}
         * @protected
         */
        _getWidgetValue: function() {
          var decoratorNode = this.getNodeBindings().decorator;
          var widget = this.getWidget();
          var value = widget.getValue();

          if (value === null || value === undefined) {
            value = "";
          } else {
            value = value.toString();
          }
          value = this._shiftConversion(value, widget, decoratorNode);
          return value;
        },

        /**
         * Strategy method which returns AUI value in VM ready format
         * @param widget
         * @returns {string}
         * @protected
         */
        _getAuiValue: function() {
          var valueNode = this.getNodeBindings().anchor;
          return valueNode.attribute("value").toString();
        },

        _shiftConversion: function(value, widget, decoratorNode) {
          // manage upshift & downshift case
          if (decoratorNode && decoratorNode.isAttributesSetByVM('shift')) {
            var shiftAttr = decoratorNode.attribute('shift');
            if (shiftAttr !== "none" && (widget.isEditing && widget.isEditing() || widget.getUserInterfaceWidget().isTypeaheadActive())) {
              switch (shiftAttr) {
                case 'up':
                  value = value.toUpperCase();
                  break;
                case 'down':
                  value = value.toLowerCase();
                  break;
              }
            }
          }
          return value;
        },

        /**
         * Sends the updated value to the DVM
         * @private
         */
        sendWidgetValue: function() {
          var valueNode = this.getNodeBindings().anchor;
          var widget = this.getWidget();
          var uiWidget = widget.getUserInterfaceWidget();

          if (widget && widget.isEnabled()) {

            var value = this._getWidgetValue();
            var auiValue = this._getAuiValue();

            if (widget._alwaysSend === true || value !== auiValue || widget._dirty === true) {

              var focusEventData = null;
              var valueEventData = {
                value: value
              };

              if (widget.getCursors && valueNode.getTag() === "FormField") {
                var cursors = widget.getCursors();
                focusEventData = {
                  cursor: cursors.start,
                  cursor2: cursors.end
                };
              }

              // We need to send two different ConfigureEvent orders to the VM to ensure focus request is the first one
              if (focusEventData) {
                var focusEvent = new cls.VMConfigureEvent(valueNode.getId(), focusEventData);
                valueNode.getApplication().event(focusEvent);
              }
              var valueEvent = new cls.VMConfigureEvent(valueNode.getId(), valueEventData);
              valueNode.getApplication().event(valueEvent);

            }
          }
        },

        typeahead: function(keys) {
          if (this.isInTable) {
            var tableController = this.getNodeBindings().container.getParentNode().getController();
            return tableController.typeahead(keys);
          }
          return keys;
        }
      };
    });
  });
