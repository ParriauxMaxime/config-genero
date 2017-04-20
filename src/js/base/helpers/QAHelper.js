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

(
  function(context) {
    if (context.gbc.unitTestMode) {
      if (!context.__testhostelement) {
        context.__testhostelement = document.createElement("div");
        context.__testhostelement.setAttribute("class", "unittesthost");

        context.__testhostelement.style.position = "absolute";
        context.__testhostelement.style.top = "-1000px";
        context.__testhostelement.style.left = "-1000px";
        context.__testhostelement.style.width = "600px";
        context.__testhostelement.style.height = "600px";
        context.__testhostelement.style.zIndex = 55;

        document.body.appendChild(context.__testhostelement);
      }
      context.gbc.__unitTestingCloseCurrentSession = function() {
        var session = context.gbc.SessionService && context.gbc.SessionService.getCurrent();
        if (session) {
          var app = session && session.getCurrentApplication();
          while (app) {
            try {
              app.stop();
              app.destroy();
            } catch (e) {}
            app = session && session.getCurrentApplication();
          }
          context.gbc.SessionService.getCurrent().destroy(true);
        }
        if (!window.gbc.__unitTestingModeActivated) {
          window.gbc.__unitTestingModeActivated = true;
          window.gbc.__unitTestingModeActivated = true;
          window.__desactivateEndingPopup = true;
          gbc.showExitWarning = function() {};
        }
      };
      /**
       *
       * @param {classes.NodeBase} node
       * @param attrs
       */
      context.testUpdateAttributes = function(node, attrs, noApply) {
        if (!!node) {
          styler.bufferize();
          var mods = [];
          mods[node._id] = true;
          node.updateAttributes(attrs);
          if (!noApply) {
            (node._id === 0 ? node : node.getAncestor("UserInterface")).applyBehaviors(mods, true);
          }
          styler.flush();
        }
      };
    }
  })(window);
