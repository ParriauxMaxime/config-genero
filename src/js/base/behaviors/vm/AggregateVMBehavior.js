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

modulum('AggregateVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.AggregateVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.AggregateVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.AggregateVMBehavior.prototype */
      return {
        __name: "AggregateVMBehavior",

        watchedAttributes: {
          anchor: ['aggregateText', 'aggregateValue'],
          parent: ['aggregateText']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var bindings = controller.getNodeBindings();
          var widget = controller.getWidget();
          if (widget && widget.setAggregate) {

            if (widget.getColumnIndex() === 0) {
              var globalText = bindings.parent.attribute('aggregateText');
              widget.getParentWidget().setAggregateGlobalText(globalText);
            }

            var text = bindings.anchor.attribute('aggregateText');
            var value = bindings.anchor.attribute('aggregateValue');

            if (text !== "") {
              text = text + " ";
            }

            widget.setAggregate(text + value);
          }
        }
      };
    });
  });
