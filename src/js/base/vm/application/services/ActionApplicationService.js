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

modulum('ActionApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ActionApplicationService
     * @extends classes.ApplicationServiceBase
     */
    cls.ActionApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      /** @lends classes.ActionApplicationService.prototype */
      return {
        __name: "ActionApplicationService",
        /** @lends classes.ActionApplicationService */
        $static: {
          _specialActions: {},
          registerSpecialAction: function(name, ctor) {
            this._specialActions[name] = ctor;
          },
          unregisterSpecialAction: function(name) {
            this._specialActions[name] = null;
          },
          /**
           * convert VM bindings to key combination that we can interpret in a browser
           * @param bindName
           * @returns {String} key combination
           */
          convertVMKeyToBrowserKey: function(bindName) {
            var key = bindName.toLowerCase();
            if (key === "return") {
              return "enter";
            }
            key = key.replace("prior", "pageup");
            key = key.replace("next", "pagedown");
            key = key.replace("-", "+");
            key = key.replace("control", "mod"); //handle mac keyboard as well
            return key;
          },
          convertBrowserKeyToVMKey: function(bindName) {
            var key = bindName.toLowerCase();
            key = key.replace("pageup", "prior");
            key = key.replace("pagedown", "next");
            key = key.replace("+", "-");
            key = key.replace("mod", "control"); //handle mac keyboard as well
            return key;
          }
        },
        _specialActions: {},
        _actions: {},
        _actionDefaults: {},
        // Convert those actions to keyEvent instead of action
        _localActions: ["nextfield", "prevfield", "nextrow", "prevrow", "firstrow", "lastrow", "nextpage", "prevpage", "nexttab",
          "prevtab"
        ],
        _ignoreActions: ["interrupt", "editcopy", "editcut", "editpaste"],

        _keyboardHelper: null,

        constructor: function(app) {
          $super.constructor.call(this, app);
          var ui = app.getUI().getWidget().getElement();
          this._keyboardHelper = context.keyboard(ui);
        },

        /**
         * Add a new action to this App Service
         * @param {classes.NodeBase} action node
         */
        registerAction: function(action) {
          var name = action.attribute("name");
          this._actions[name] = action;
          this.registerAccelerator("acceleratorName", action);
          this.registerAccelerator("acceleratorName2", action);
          this.registerAccelerator("acceleratorName3", action);
          this.registerAccelerator("acceleratorName4", action);
          if (!!cls.ActionApplicationService._specialActions[name]) {
            this._specialActions[name] = new cls.ActionApplicationService._specialActions[name](this);
          }
        },

        /**
         * Add a new actionDefault to this App Service
         * @param {classes.NodeBase} action node
         */
        registerActionDefault: function(action) {
          this._actionDefaults[action.attribute("name")] = action;

          this.registerAccelerator("acceleratorName", action);
          this.registerAccelerator("acceleratorName2", action);
          this.registerAccelerator("acceleratorName3", action);
          this.registerAccelerator("acceleratorName4", action);

        },

        /**
         * Bind accelerator keys to the action
         * @param {String} acceleratorName key combination as described by the VM
         * @param {classes.NodeBase} action node
         */
        registerAccelerator: function(acceleratorName, action) {
          var aName = action.attribute(acceleratorName);

          if (aName && aName.length > 0) {

            this._keyboardHelper.bind(cls.ActionApplicationService.convertVMKeyToBrowserKey(aName), this._actionExecute.bind(this,
              action._id));

          }
        },

        _actionExecute: function(id) {
          return this.execute(id);
        },
        /**
         * Remove the action and unbind accelerators
         * @param {classes.NodeBase} action
         */
        destroyAction: function(action) {
          this._unbindAccelerators(action);

          var name = action.attribute("name");
          this._actions[name] = null;
          if (!!this._specialActions[name]) {
            this._specialActions[name].destroy();
            this._specialActions[name] = null;
          }
        },

        /**
         * Remove the actionDefault and unbind accelerators
         * @param {classes.NodeBase} action
         */
        destroyActionDefault: function(action) {
          this._unbindAccelerators(action);

          var acceleratorName = action.attribute("name");
          delete this._actionDefaults[acceleratorName];
        },

        _unbindAccelerators: function(action) {
          // Remove all accelerator bound for this action...
          var action1 = action.attribute("acceleratorName");
          var action2 = action.attribute("acceleratorName2");
          var action3 = action.attribute("acceleratorName3");
          var action4 = action.attribute("acceleratorName4");

          if (action1 && action1.length > 0) {
            this._keyboardHelper.unbind(cls.ActionApplicationService.convertVMKeyToBrowserKey(action1));
          }
          if (action2 && action2.length > 0) {
            this._keyboardHelper.unbind(cls.ActionApplicationService.convertVMKeyToBrowserKey(action2));
          }
          if (action3 && action3.length > 0) {
            this._keyboardHelper.unbind(cls.ActionApplicationService.convertVMKeyToBrowserKey(action3));
          }
          if (action4 && action4.length > 0) {
            this._keyboardHelper.unbind(cls.ActionApplicationService.convertVMKeyToBrowserKey(action4));
          }
        },

        /**
         * Get the action by its name
         * @param {String} name of the action
         * @returns {classes.NodeBase} action node
         */
        getAction: function(name) {
          return this._actions[name];
        },

        /**
         * Test if the action is registered
         * @param {String} name of the action
         * @returns {boolean} action node
         */
        hasAction: function(name) {
          return !!this._actions[name];
        },

        /**
         * Execute an action by knowing its name
         * @param {String} name of the action
         */
        executeByName: function(name) {
          var action = this.getAction(name);
          if (!!action) {
            this.execute(action._id);
          } else {
            this.executeActionDefaultByName(name);
          }
        },

        /**
         * Execute an action by knowing its name
         * @param {String} name of the action
         */
        executeActionDefaultByName: function(name) {
          var action = this._actionDefaults[name];
          var accelerator = action && action.attribute("acceleratorName");
          var actionEvent = null;

          if (this._localActions.indexOf(name) >= 0) {
            switch (name) {
              case "nextfield":
                // what if local action AND action have the same name?
                actionEvent = new cls.VMKeyEvent("Tab");
                break;
              case "prevfield":
                actionEvent = new cls.VMKeyEvent("Shift-Tab");
                break;
              case "nextrow":
                actionEvent = new cls.VMKeyEvent("Down");
                break;
              case "prevrow":
                actionEvent = new cls.VMKeyEvent("Up");
                break;
              default:
                if (accelerator && accelerator.length > 0) {
                  actionEvent = new cls.VMKeyEvent(accelerator);
                }
                break;
            }
          }

          window.requestAnimationFrame(function() {
            this._application.event(actionEvent);
          }.bind(this));
        },

        /**
         * Execute an action by knowing its ID
         * @param {Number} idRef of the action
         * @param {classes.NodeBase=} additionnalValueNode an additionnal value node which value should be sent to the VM too. (CheckBox special case)
         */
        execute: function(idRef, additionnalValueNode) {
          var actionNode = this._application.getNode(idRef);
          var actionName = actionNode ? actionNode.attribute("name") : null;

          if (!this.getAction(actionName) && this._localActions.indexOf(actionName) >= 0) {
            this.executeActionDefaultByName(actionName);
            return false;
          }

          if (this._ignoreActions.indexOf(actionName) >= 0) {
            return true; // pass through events
          }
          var actionEvent = new cls.VMActionEvent(idRef);
          var focusedNode = this._application.getFocusedVMNode();
          var controller = null;
          /*
          if (focusedNode) {
            controller = focusedNode.getController();
            if (controller && controller.sendWidgetValue) {
              controller.sendWidgetValue();
            }
          }
          */

          if (additionnalValueNode && focusedNode !== additionnalValueNode) {
            controller = additionnalValueNode.getController();
            if (controller && controller.sendWidgetValue) {
              controller.sendWidgetValue();
            }
          }
          this._application.event(actionEvent);
          return false;
        }
      };
    });
    cls.ApplicationServiceFactory.register("Action", cls.ActionApplicationService);
  });
