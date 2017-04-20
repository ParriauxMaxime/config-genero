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

modulum('StandardNode', ['NodeBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.StandardNode
     * @extends classes.NodeBase
     */
    cls.StandardNode = context.oo.Class(cls.NodeBase, function() {
      /** @lends classes.StandardNode.prototype */
      return {
        __name: "StandardNode",
        /**
         *
         * @returns {classes.ControllerBase}
         * @protected
         */
        _createController: function() {
          return cls.ControllerFactory.create(this._tag, {
            anchor: this,
            parent: this._parent,
            ui: this.getApplication().getNode(0)
          });
        }
      };
    });
  });
