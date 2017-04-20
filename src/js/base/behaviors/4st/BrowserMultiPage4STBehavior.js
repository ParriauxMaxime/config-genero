/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('BrowserMultiPage4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.BrowserMultiPage4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.BrowserMultiPage4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.BrowserMultiPage4STBehavior.prototype */
      return {
        __name: "BrowserMultiPage4STBehavior",

        usedStyleAttributes: ["BrowserMultiPage"],

        _apply: function(controller, data) {
          var node = controller && controller.getAnchorNode(),
            app = node && node.getApplication(),
            session = app && app.getSession(),
            isAvailable = session && (cls.ServerHelper.compare(session.info().serverVersion, "GAS/3.00.22") >= 0);

          if (app && isAvailable) {
            app.setBrowserMultiPageMode(this.isSAYesLike(node.getStyleAttribute('browserMultiPage')));
          }
        }
      };
    });
  });
