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

modulum('DateTimeValueVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Manage both value and DBDATE format.
     * @class classes.DateTimeValueVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.DateTimeValueVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.DateTimeValueVMBehavior.prototype */
      return {
        __name: "DateTimeValueVMBehavior",

        watchedAttributes: {
          anchor: ['value'],
          container: ['varType']
        },

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) { // for label the function to change text is setValue
            var bindings = controller.getNodeBindings();
            var type = bindings.container.attribute('varType');
            var value = bindings.anchor.attribute('value');
            if (type || value) {
              widget._dirty = false;
              // true if minute not found, false otherwise
              var sec = !type || !~type.toLowerCase().indexOf("minute");

              var isConstruct = bindings.container.attribute('dialogType') === "Construct";
              var displayFormat = "";
              if (isConstruct) { // in construct, we display ISO format. No conversion is done.
                displayFormat = cls.DateTimeHelper.getISOFormat(sec);
              } else { // Use DBDATE format
                var dbDate = widget.getUserInterfaceWidget().getDbDateFormat();
                displayFormat = cls.DateTimeHelper.parseDbDateFormat(dbDate);
                displayFormat += (sec ? " HH:mm:ss" : " HH:mm");
              }

              if (widget.setFormat) {
                widget.setFormat(displayFormat);
              }

              if (value && !isConstruct) {
                value = cls.DateTimeHelper.toDbDateFormat(value, displayFormat);
              }

              if (widget.setValue) {
                widget.setValue(value);
              }
            }
          }
        }
      };
    });
  });
