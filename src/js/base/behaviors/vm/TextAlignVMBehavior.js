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

modulum('TextAlignVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.TextAlignVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TextAlignVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TextAlignVMBehavior.prototype */
      return {
        __name: "TextAlignVMBehavior",

        watchedAttributes: {
          anchor: ['numAlign'],
          container: ['numAlign'],
          decorator: ['justify']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var bindings = controller.getNodeBindings();
          var justifyNode = bindings.decorator ? bindings.decorator : bindings.anchor;
          var numAlignNode = bindings.container ? bindings.container : bindings.anchor;
          var widget = controller.getWidget();
          if (widget && widget.__name === "TableColumnWidget") {
            widget = widget.getTitleWidget();
          }
          if (widget && widget.setTextAlign) {
            var textAlign = null;

            if (justifyNode.isAttributesSetByVM('justify')) {
              textAlign = justifyNode.attribute('justify');
            } else if (numAlignNode.attribute('numAlign') === 1) {
              textAlign = 'right';
            }

            if (widget.__name === "TableColumnTitleWidget") {
              if (widget._autoAlignment === true) {
                widget.setTextAlign(textAlign);
              }
            } else {
              widget.setTextAlign(textAlign);
            }
          }
        }
      };
    });
  });
