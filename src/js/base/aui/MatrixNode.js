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

modulum('MatrixNode', ['StandardNode', 'NodeFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.MatrixNode
     * @extends classes.StandardNode
     */
    cls.MatrixNode = context.oo.Class(cls.StandardNode, function() {
      /** @lends classes.MatrixNode.prototype */
      return {
        __name: "MatrixNode",
        /**
         *
         * @protected
         */
        _createChildrenControllers: function(_queue) {
          for (var i = 1; i < this._children.length; i++) {
            this._children[i].createController(_queue);
          }
        },

        /**
         * Will get current value node in matrix
         * @param inputModeOnly return value node only if is node is in INPUT mode
         * @returns {*}
         */
        getCurrentValueNode: function(inputModeOnly) {
          var dialogType = this.attribute('dialogType');
          var isInputMode = (dialogType === "Input" || dialogType === "InputArray" || dialogType === "Construct");
          if (!inputModeOnly || isInputMode) {
            var currentRow = this.attribute("currentRow") || 0;
            var offset = this.attribute("offset");
            var valueIndex = currentRow - offset;
            if (this._children[1]._children[valueIndex]) {
              return this._children[1]._children[valueIndex];
            }
          }
          return null;
        }
      };
    });
    cls.NodeFactory.register("Matrix", cls.MatrixNode);
  });
