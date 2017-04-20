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

modulum('SpacerItemController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.SpacerItemController
     * @extends classes.ControllerBase
     */
    cls.SpacerItemController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.SpacerItemController.prototype */
      return {
        __name: "SpacerItemController",

        _initBehaviors: function() {
          $super._initBehaviors.call(this);
          var anchor = this.getNodeBindings().anchor;

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          // this._addBehavior(new cls.LayoutInfoVMBehavior(this, anchor));
          // END WARNING

        },
        _createWidget: function() {
          return cls.WidgetFactory.create('SpacerItem', this.getAnchorNode().attribute('style'), {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            auiTag: this.getAnchorNode().getId()
          });
        }
      };
    });
    cls.ControllerFactory.register("SpacerItem", cls.SpacerItemController);

  });
