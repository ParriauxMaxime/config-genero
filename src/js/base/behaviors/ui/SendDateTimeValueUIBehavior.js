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

modulum('SendDateTimeValueUIBehavior', ['SendValueUIBehavior'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's visibility
     * @class classes.SendDateTimeValueUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.SendDateTimeValueUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.SendDateTimeValueUIBehavior.prototype */
      return {
        __name: "SendDateTimeValueUIBehavior",

        _attachWidget: function(controller, data) {
          cls.SendValueUIBehavior._attachWidget.call(this, controller, data);
        },

        _detachWidget: function(controller, data) {
          cls.SendValueUIBehavior._detachWidget.call(this, controller, data);
        },

        /**
         * This method gets called when the widget emits its 'changed' event
         * @private
         */
        _onChange: function(controller, data, event, sender, nativeEvent, isTextEntry) {
          cls.SendValueUIBehavior._onChange.call(this, controller, data, event, sender, nativeEvent, isTextEntry);
        },

        /**
         * Checks if the value has changed
         * @returns {boolean} true if the value has changed, false otherwise
         * @private
         */
        _hasValueChanged: function(controller, data) {
          var bindings = controller.getNodeBindings();
          var valueNode = bindings.anchor;
          var containerNode = bindings.container;

          var widget = controller.getWidget();
          var value = widget.getValue();
          if (value === null || value === undefined) {
            value = "";
          }
          var widgetValue = value.toString();
          if (widget.getFormat && widgetValue && containerNode.attribute('dialogType') !== "Construct") {
            var dbdateformat = widget.getFormat();
            widgetValue = cls.DateTimeHelper.toISOFormat(widgetValue, dbdateformat);
          }
          var auiValue = valueNode.attribute('value').toString();
          return widgetValue !== auiValue;
        }
      };
    });
  });
