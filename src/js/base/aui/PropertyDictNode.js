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

modulum('PropertyDictNode', ['StandardNode', 'NodeFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.PropertyDictNode
     * @extends classes.StandardNode
     */
    cls.PropertyDictNode = context.oo.Class(cls.StandardNode, function($super) {
      /** @lends classes.PropertyDictNode.prototype */
      return {
        constructor: function(parent, tag, id, attributes, app) {
          this._canEmitNodeMutation = true;
          $super.constructor.call(this, parent, tag, id, attributes, app);
        }
      };
    });
    cls.NodeFactory.register("PropertyDict", cls.PropertyDictNode);
  });
