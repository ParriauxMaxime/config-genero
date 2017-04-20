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

modulum('UIBehaviorBase', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.UIBehaviorBase
     * @extends classes.BehaviorBase
     */
    cls.UIBehaviorBase = context.oo.Class(cls.BehaviorBase, function($super) {
      /** @lends classes.UIBehaviorBase.prototype */
      return {
        __name: "UIBehaviorBase",
        _apply: Function.noop
      };
    });
  });
