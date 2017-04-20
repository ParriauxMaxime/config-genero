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

modulum('OnSplitterUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.OnSplitterUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.OnSplitterUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.OnSplitterUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "OnSplitterUIBehavior",

        _attachWidget: function(controller, data) {
          if (!!controller.getWidget()) {
            data.splitterHandle = controller.getWidget().when(context.constants.widgetEvents.splitter, this._onSplitter.bind(this,
              controller,
              data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.splitterHandle) {
            data.splitterHandle();
            data.splitterHandle = null;
          }
        },

        _onSplitter: function(controller, data) {
          controller.getWidget().getLayoutEngine().invalidateAllocatedSpace();
          controller.getAnchorNode().getApplication().layout.refreshLayout();
        }
      };
    });
  });
