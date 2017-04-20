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

modulum('FormatVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Manage both DBDATE and Format attribute. If a Format attribute is specified it replaces DBDATE format
     * @class classes.FormatVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.FormatVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.FormatVMBehavior.prototype */
      return {
        __name: "FormatVMBehavior",

        watchedAttributes: {
          decorator: ['format']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFormat) {
            var decoratorNode = controller.getNodeBindings().decorator;
            if (decoratorNode.isAttributesSetByVM('format') && decoratorNode.attribute('format')) {
              var format = decoratorNode.attribute('format');
              widget.setFormat(format.toUpperCase());
            } else {
              var dbDate = widget.getUserInterfaceWidget().getDbDateFormat();
              var tradionalFormat = cls.DateTimeHelper.parseDbDateFormat(dbDate);
              widget.setFormat(tradionalFormat);
            }
          }
        }
      };
    });
  });
