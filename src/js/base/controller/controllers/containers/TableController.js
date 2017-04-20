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

modulum('TableController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableController
     * @extends classes.ControllerBase
     */
    cls.TableController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.TableController.prototype */
      return {
        __name: "TableController",

        _storedSettingsKey: null,

        // specific variables used for multirow selection
        _multiRowSelectionRoot: -1,
        _updateMultiRowSelectionRoot: false,

        forceDefaultSettings: false,
        nativeVerticalScroll: true,

        /**
         * @constructs {classes.TableController}
         * @param {ControllerBindings} bindings
         */
        constructor: function(bindings) {
          $super.constructor.call(this, bindings);

          this._initStoredSettings();
        },

        /**
         *
         * @param {string=} kind
         * @returns {classes.WidgetBase}
         * @protected
         */
        _createWidget: function(type) {

          var parentPageWidget = null;
          var parentAppWidget = this.getUINode().getController().getWidget();
          var parentPageNode = this.getAnchorNode().getAncestor("Page");
          if (parentPageNode) {
            parentPageWidget = parentPageNode.getController().getWidget();
          }

          return cls.WidgetFactory.create('Table', this.getAnchorNode().attribute('style'), {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            auiTag: this.getAnchorNode().getId(),
            appWidget: parentAppWidget,
            folderPageWidget: parentPageWidget
          });
        },

        _initStoredSettings: function() {
          var node = this.getNodeBindings().anchor;

          // Build stored settings key
          var formName = node.getAncestor("Form").attribute("name");
          var tabName = node.attribute("tabName");
          this._storedSettingsKey = "gwc.forms." + formName + ".tables." + tabName;

          //Check if there are stored settings with a wrong validation key
          var validationKey = this.getStoredSettingsValidationKey();
          var storedValidationKey = this.getStoredSetting("validationKey");

          if (!!storedValidationKey && storedValidationKey !== validationKey) {
            // in this case remove stored settings because the validationKey doesn't match
            gbc.StoredSettingsService.removeSettings(this._storedSettingsKey);
          }

          this.setStoredSetting("validationKey", validationKey);
        },

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          this._addBehavior(cls.FocusCurrentCellPseudoSelectorBehavior);
          this._addBehavior(cls.OffsetPseudoSelectorBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.TableDialogTypeVMBehavior);
          this._addBehavior(cls.StyleVMBehavior);
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.FocusOnFieldVMBehavior);
          this._addBehavior(cls.CurrentColumnVMBehavior);
          this._addBehavior(cls.CurrentRowVMBehavior);
          this._addBehavior(cls.VisibleRowsVMBehavior);
          this._addBehavior(cls.MultiRowSelectionVMBehavior);
          this._addBehavior(cls.TableSortVMBehavior);
          this._addBehavior(cls.NativeScrollVMBehavior);
          this._addBehavior(cls.WantFixedPageSizeVMBehavior);
          this._addBehavior(cls.PageSizeVMBehavior);

          // ui behaviors
          this._addBehavior(cls.ScrollUIBehavior);
          this._addBehavior(cls.OnLayoutUIBehavior);
          this._addBehavior(cls.RowAndSelectionUIBehavior);
          this._addBehavior(cls.TableFrozenUIBehavior);
          this._addBehavior(cls.TableResetToDefaultUIBehavior);

          // 4st behaviors
          this._addBehavior(cls.TableType4STBehavior);
          this._addBehavior(cls.FrozenColumns4STBehavior);
          this._addBehavior(cls.TableHeader4STBehavior);
          this._addBehavior(cls.ShowGrid4STBehavior);
          this._addBehavior(cls.AllowWebSelection4STBehavior);
          this._addBehavior(cls.TableHighlight4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.ForceDefaultSettings4STBehavior);
          this._addBehavior(cls.ResizeFillsEmptySpace4STBehavior);
        },

        /**
         * Build row selection event
         * @param {number} row - row selected
         * @param {boolean} ctrlKey - true if ctrl key is pressed
         * @param {boolean} shiftKey - true if shift key is pressed
         * @returns {object} row selection event
         */
        buildRowSelectionEvent: function(row, ctrlKey, shiftKey) {

          var node = this.getNodeBindings().anchor;
          var startIndex = row;
          var endIndex = row;
          var mode = "set";

          if (shiftKey) {
            if (this._multiRowSelectionRoot === -1) {
              this._multiRowSelectionRoot = node.attribute('currentRow');
            }

            startIndex = this._multiRowSelectionRoot;
            endIndex = row;
            mode = ctrlKey ? "exset" : "set";

            this._updateMultiRowSelectionRoot = false;
          } else if (ctrlKey) {
            var children = node.getChildren();
            var rowInfoListNode = children[children.length - 1];
            var rowInfoNode = rowInfoListNode.getChildren()[row - node.attribute('offset')];
            mode = rowInfoNode.attribute('selected') === 1 ? "unset" : "exset";
          }

          return new cls.VMRowSelectionEvent(node.getId(), {
            startIndex: startIndex,
            endIndex: endIndex,
            selectionMode: mode
          });
        },

        setFocus: function() {
          var tableNode = this.getAnchorNode();
          var valueNode = tableNode.getCurrentValueNode(true);
          var widget = null;
          if (valueNode) {
            var controller = valueNode.getController();
            if (controller) {
              widget = controller.getWidget();
              if (widget && widget.setFocus) {
                widget.setFocus();
              }
            }
          } else {
            widget = this.getWidget();
            if (widget) {
              this.getWidget().setFocus();
            }
          }
        },

        /**
         * Sends the updated value to the DVM
         * @private
         */
        sendWidgetValue: function() {
          var valueNode = this.getAnchorNode().getCurrentValueNode(true);
          if (valueNode) {
            if (valueNode.getController().sendWidgetValue) {
              valueNode.getController().sendWidgetValue();
            }
          }
        },

        /** Build and return validationKey for stored settings
         * @returns {string} validationKey
         */
        getStoredSettingsValidationKey: function() {
          var anchor = this.getNodeBindings().anchor;
          var validationKey = "";

          validationKey += anchor.attribute("pageSize") + ";";
          validationKey += anchor.attribute("sortColumn") + ";";
          validationKey += anchor.attribute("sortType") + ";";

          var columns = anchor.getChildren("TableColumn");
          for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            validationKey += column.getFirstChild().attribute("width") + ";";
          }

          if (anchor.getStyleAttribute("tableType") === "frozenTable") {
            validationKey += anchor.getStyleAttribute("leftFrozenColumns") + ";";
            validationKey += anchor.getStyleAttribute("rightFrozenColumns") + ";";
          }

          return validationKey;
        },

        /** Set a stored setting for this table
         * @param key
         * @param value
         */
        setStoredSetting: function(key, value) {
          if (this.forceDefaultSettings) {
            return null;
          } else {
            gbc.StoredSettingsService.setSettings(this._storedSettingsKey + "." + key, value);
          }
        },

        /** Get a stored setting for this table
         * @param key
         * @returns {*}
         */
        getStoredSetting: function(key) {
          if (this.forceDefaultSettings) {
            return null;
          } else {
            return gbc.StoredSettingsService.getSettings(this._storedSettingsKey + "." + key);
          }
        },

        resetStoredSetting: function() {
          if (this.forceDefaultSettings) {
            return null;
          } else {
            gbc.StoredSettingsService.setSettings(this._storedSettingsKey, {}, true);
          }
        },

        typeahead: function(keys) {
          var events = [];
          var consumed = true;
          while (keys.length !== 0 && consumed) {
            var key = keys[0];
            consumed = false;
            // only key down and up are managed for the moment
            if (key === "down" || key === "up") {
              var keyEvent = new cls.VMKeyEvent(key);
              keyEvent.directFire = false;
              events.push(keyEvent);
              keys.shift();
              consumed = true;
            } else {
              consumed = false;
            }
          }

          if (events.length > 0) { // send all keys in one block
            this.getAnchorNode().getApplication().event(events);
          }

          return keys;
        }

      };
    });
    cls.ControllerFactory.register("Table", cls.TableController);

  });
