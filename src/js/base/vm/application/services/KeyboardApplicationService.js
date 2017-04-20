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

modulum('KeyboardApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.KeyboardApplicationService
     * @extends classes.ApplicationServiceBase
     */
    cls.KeyboardApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      /** @lends classes.KeyboardApplicationService.prototype */
      return {
        __name: "KeyboardApplicationService",
        /** @lends classes.KeyboardApplicationService */
        $static: {
          keymap: {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            19: 'pause',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            92: 'meta',
            93: 'contextmenu',
            112: 'f1',
            113: 'f2',
            114: 'f3',
            115: 'f4',
            116: 'f5',
            117: 'f6',
            118: 'f7',
            119: 'f8',
            120: 'f9',
            121: 'f10',
            122: 'f11',
            123: 'f12',
            144: 'numlock',
            145: 'scrolllock',
            224: 'meta',
          },
        },

        _buffering: false,
        _bufferedKeys: null,
        _disabledWidget: null,

        _debug: false,

        constructor: function(app) {
          $super.constructor.call(this, app);
          this._debug = context.DebugService.isActive();
          this._bufferedKeys = [];
        },
        /**
         * frees memory hooks of this service (typically when application is destroyed)
         */
        destroy: function() {
          this.endCapture();
          $super.destroy.call(this);
        },

        beginCapture: function() {
          if (!this._buffering) { // if not already capturing
            var uiWidget = this._application.getUI().getWidget()._uiWidget;
            if (uiWidget) {
              var focusedNode = this._application.getFocusedVMNodeAndValue();
              if (focusedNode) {
                var focusedWidget = focusedNode.getController() && focusedNode.getController().getWidget();
                // if widget was previously editable, we set it as readonly
                if (focusedWidget) {
                  if (focusedWidget && focusedWidget._destroyed === false) {
                    focusedWidget.gbcReadonly(true);
                  }
                }
              }
              var uiElement = uiWidget.getElement();
              if (uiElement) {
                context.LogService.typeahead.log("beginCapture");
                this._buffering = true;
                uiWidget.setTypeahead(true);
                uiElement.off("keydown.UserInterfaceWidget");
                uiElement.off("keypress.UserInterfaceWidget");
                //uiElement.off("keyup.UserInterfaceWidget");
                uiElement.on("keydown.UserInterfaceWidget", this._onKeyDown.bind(this));
                uiElement.on("keypress.UserInterfaceWidget", this._onKeyPress.bind(this));
                //uiElement.on("keyup.UserInterfaceWidget", this._onKeyUp.bind(this));
              }
            }
          }
        },

        endCapture: function() {
          var uiWidget = this._application.getUI().getWidget()._uiWidget;
          if (uiWidget) {
            var focusedNode = this._application.getFocusedVMNodeAndValue();
            if (focusedNode) {
              var focusedWidget = focusedNode.getController() && focusedNode.getController().getWidget();
              if (focusedWidget) {
                // if widget is editable
                if (focusedWidget._destroyed === false && !focusedWidget.isReadOnly()) {
                  focusedWidget.gbcReadonly(false);
                }
              }
            }
            if (this._buffering) {
              var uiElement = uiWidget.getElement();
              if (uiElement) {
                context.LogService.typeahead.log("endCapture");
                uiElement.off("keydown.UserInterfaceWidget");
                uiElement.off("keypress.UserInterfaceWidget");
                //uiElement.off("keyup.UserInterfaceWidget");
                this._buffering = false;
                uiWidget.setTypeahead(false);
              }
            }
          }
        },

        _onKeyDown: function(event) {
          if (this._buffering) {
            event.stopPropagation();

            var combinaison = this.translateKeys(event);

            context.LogService.typeahead.log("onKeyDown (event.which " + event.which + ", event.key " + event.key +
              ") translated key: " + combinaison);
            if (combinaison && combinaison !== "unidentified") {
              var key = this.getKey(event);
              // we prevent default browser action for any combinaison which use ctrl without alt, or for special keys such as backspace
              if (key.length > 1 || (event.altKey === false && (event.ctrlKey === true || event.metaKey === true))) {
                context.LogService.typeahead.log("onKeyDown PREVENTDEFAULT");
                event.preventDefault();
              }
              this._bufferedKeys.push(combinaison);
              context.LogService.typeahead.log("onKeyDown added " + combinaison + " in bufferedKeys : ", this._bufferedKeys);
            }
          }
        },

        _onKeyPress: function(event) {
          // keypress doesn't raise for modifiers which do not generate a displayable character for most common browsers
          // except safari which raise keypress each time alt key is pressed even if no character is generated.
          if (this._buffering) {
            event.preventDefault();
            var key = this.getKey(event);

            context.LogService.typeahead.log("onKeyPress (event.which " + event.which + ", event.key " + event.key +
              ") translated key: " + key);

            if (key && event.which > 19) { // don't add hidden special keys sometimes detected by keypress
              // for any displayed char detected by keypress, replace its previous associated combinaison with the final char
              this._bufferedKeys.splice(this._bufferedKeys.length - 1, 1, key);
              context.LogService.typeahead.log("onKeyPress REWORK of bufferedKeys : ", this._bufferedKeys);
            }
          }
        },

        _onKeyUp: function(event) {
          /*if (this._buffering) {
           event.preventDefault();
           var key = this.translateKeys(event);

           context.LogService.typeahead.log("onKeyUp (event.which " + event.which + ", event.key " + event.key +
           ") translated key: " + key);

           }*/
        },

        isBasicModifier: function(key) {
          var k = key.toLowerCase();
          return k === 'shift' || k === 'ctrl' || k === 'alt' || k === 'meta' || k === 'dead';
        },

        getKey: function(event) {
          var key = "";
          if (window.browserInfo.isSafari) {
            // get the corresponding key but returns upper key for letters.
            // use keyIdentifier in keydown and which (keycode) in keypress
            if (event.keyIdentifier) {
              key = String.fromCharCode(parseInt(event.keyIdentifier.substr(2), 16));
              var upper = event.shiftKey || (event.getModifierState && event.getModifierState('CapsLock'));
              // detect if shit or capslock is active to get proper letter upper or lower case
              key = upper ? key : key.toLowerCase();
            } else {
              key = String.fromCharCode(event.which);
            }
          } else {
            key = event.key;
          }
          return key;
        },

        translateKeys: function(event) {
          var key = cls.KeyboardApplicationService.keymap[event.which] || "";
          var ctrlKey = event.ctrlKey;
          var altKey = event.altKey;
          var shiftKey = event.shiftKey;
          var metaKey = event.metaKey;
          if (!key) {
            key = this.getKey(event);
          }
          if (window.browserInfo.isEdge || window.browserInfo.isIE) {
            key = key.replace("Divide", "/").replace("Multiply", "*").replace("Subtract", "-").replace("Add", "+").replace(
              "Decimal", ".");
          }
          var keys = "";
          if (!this.isBasicModifier(key)) {
            if (metaKey) {
              keys += "meta";
            }
            // use that order : ctrl+shift+alt
            if (ctrlKey) {
              if (keys.length !== 0) {
                keys += '+';
              }
              keys += "ctrl";
            }
            if (shiftKey) {
              if (keys.length !== 0) {
                keys += '+';
              }
              keys += "shift";
            }
            if (altKey) {
              if (keys.length !== 0) {
                keys += '+';
              }
              keys += "alt";
            }
            if (keys.length !== 0) {
              keys += '+';
            }
            keys += key;
          }
          return keys.toLowerCase(); // return any combinaison in lowercase
        },

        flushBufferedKeys: function() {
          context.LogService.typeahead.log("flushBufferedKeys bufferedKeys = ", this._bufferedKeys);
          if (this._bufferedKeys.length > 0) {
            var focusedNode = this._application.getFocusedVMNodeAndValue();
            if (focusedNode) {
              var controller = focusedNode.getController();
              if (controller) {
                var handled = false;
                if (controller.ignoreTypeahead === true) {
                  this._bufferedKeys = [];
                  context.LogService.typeahead.log("flushBufferedKeys typeahead ignored and stopped");

                } else {
                  context.LogService.typeahead.log("flushBufferedKeys begin to loop over bufferedKeys ", this._bufferedKeys);
                }
                while (!handled && this._bufferedKeys.length > 0) {
                  if (controller.typeahead) { // execute buffered keys action on widget using its own implementation
                    context.LogService.typeahead.log("flushBufferedKeys typeahead on : ", this._bufferedKeys, focusedNode);
                    this._bufferedKeys = controller.typeahead(this._bufferedKeys); // update value & cursors
                  }
                  var key = this._bufferedKeys.shift();
                  if (key) {
                    var currentWindowId = this._application.uiNode().attribute("currentWindow");
                    var window = this._application.getNode(currentWindowId);
                    var vmKey = this.convertBrowserKeyToVMKey(key);
                    var acceleratorName = null;
                    var acceleratorName2 = null;
                    var acceleratorName3 = null;
                    var acceleratorName4 = null;
                    var i = 0;
                    if (window) {
                      var dialog = window.getActiveDialog();
                      if (dialog) {
                        var actions = dialog.getChildren();
                        for (i = 0; i < actions.length; ++i) {
                          var action = actions[i];
                          acceleratorName = action.attribute("acceleratorName");
                          acceleratorName2 = action.attribute("acceleratorName2");
                          acceleratorName3 = action.attribute("acceleratorName3");
                          acceleratorName4 = action.attribute("acceleratorName4");
                          if (acceleratorName && acceleratorName.toLowerCase() === vmKey ||
                            acceleratorName2 && acceleratorName2.toLowerCase() === vmKey ||
                            acceleratorName3 && acceleratorName3.toLowerCase() === vmKey ||
                            acceleratorName4 && acceleratorName4.toLowerCase() === vmKey) {
                            var actionEvent = new cls.VMActionEvent(action.getId());
                            this.sendFocusedWidgetValue();
                            context.LogService.typeahead.log("flushBufferedKeys found Action & send ActionEvent for key : ", key);
                            this._application.event(actionEvent);
                            handled = true;
                          }
                        }
                      }
                    }
                    if (!handled) {
                      var actionDefaultList = this._application.uiNode().getFirstChild("ActionDefaultList");
                      if (actionDefaultList) {
                        var actionDefaults = actionDefaultList.getChildren();
                        for (i = 0; i < actionDefaults.length; ++i) {
                          var actionDefault = actionDefaults[i];
                          acceleratorName = actionDefault.attribute("acceleratorName");
                          acceleratorName2 = actionDefault.attribute("acceleratorName2");
                          acceleratorName3 = actionDefault.attribute("acceleratorName3");
                          acceleratorName4 = actionDefault.attribute("acceleratorName4");
                          if (acceleratorName && acceleratorName.toLowerCase() === vmKey ||
                            acceleratorName2 && acceleratorName2.toLowerCase() === vmKey ||
                            acceleratorName3 && acceleratorName3.toLowerCase() === vmKey ||
                            acceleratorName4 && acceleratorName4.toLowerCase() === vmKey) {
                            var vmEvent = new cls.VMKeyEvent(vmKey);
                            this.sendFocusedWidgetValue();
                            context.LogService.typeahead.log("flushBufferedKeys found ActionDefault & send KeyEvent for key : ",
                              vmKey);

                            this._application.event(vmEvent);
                            handled = true;
                          }
                        }
                      }
                    }
                  }
                }
                context.LogService.typeahead.log("flushBufferedKeys end loop");
              }
            }
          }
          context.LogService.typeahead.log("isProcessing()=", this._application.isProcessing(), " pendingRequest=", this._application
            .pendingRequest);
          if (this._bufferedKeys.length === 0 && !this._application.isProcessing() && !this._application.pendingRequest) { // managed all buffered keys, we stop typeahead
            context.LogService.typeahead.log("flushBufferedKeys bufferedKeys list is empty or application is no more processing");
            this.endCapture();
          }
        },

        convertBrowserKeyToVMKey: function(bindName) {
          var key = bindName.toLowerCase();
          key = key.replace("pageup", "prior");
          key = key.replace("pagedown", "next");
          key = key.replace("+", "-");
          key = key.replace("mod", "control"); //handle mac keyboard as well
          return key;
        },

        sendFocusedWidgetValue: function() {
          var focusedNode = this._application.getFocusedVMNode();
          var controller = null;
          if (focusedNode) {
            controller = focusedNode.getController();
            if (controller && controller.sendWidgetValue) {
              controller.sendWidgetValue();
            }
          }
        },

        // For test and debug purpose only
        __setTypeaheadMinDuration: function(ms) {
          // this code is to be sure typeahead is activated during XXXXms
          // because flushBufferedKeys (and endCapture keys) are done after layout
          this._application.layout._throttleTimeout = ms;
        },

        __getTypeaheadMinDuration: function() {
          // because flushBufferedKeys (and endCapture keys) are done after layout
          return this._application.layout._throttleTimeout;
        }
      };
    });
    cls.ApplicationServiceFactory.register("Keyboard", cls.KeyboardApplicationService);
  });
