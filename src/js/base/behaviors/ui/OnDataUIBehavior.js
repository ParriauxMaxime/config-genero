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

modulum('OnDataUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.OnDataUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.OnDataUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.OnDataUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "OnDataUIBehavior",

        _attachWidget: function(controller, data) {
          if (!!controller.getWidget()) {
            data.dataHandle = controller.getWidget().when(cls.WebComponentWidget.dataEvent, this._onData.bind(this, controller,
              data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.dataHandle) {
            data.dataHandle();
            data.dataHandle = null;

          }
        },

        /**
         * On data widget event
         * @private
         */
        _onData: function(controller, data, event, widget, eventData) {
          var node = controller.getAnchorNode();
          var vmEvent = new cls.VMConfigureEvent(node.getId(), {
            value: eventData
          });

          if (widget._flushValue !== eventData) {
            widget._flushValue = eventData;
          }

          if (eventData !== node.attribute("value")) {
            node.getApplication().event(vmEvent);
          }
        }
      };
    });
  });
