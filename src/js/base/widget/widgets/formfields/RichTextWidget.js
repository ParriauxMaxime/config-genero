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

modulum('RichTextWidget', ['WebComponentWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * TextEdit widget.
     * @class classes.RichTextWidget
     * @extends classes.WebComponentWidget
     */
    cls.RichTextWidget = context.oo.Class(cls.WebComponentWidget, function($super) {
      /** @lends classes.RichTextWidget.prototype */
      return {
        __name: "RichTextWidget",
        /**
         * @type Element
         */
        _initialized: false,
        _richtextPath: "resources/webcomponents/fglrichtext/fglrichtext.html",
        // Use this line if gbc should use the FGL richtext editor (only for 3.10)
        // _richtextPath: "",

        _tinyMCEproperties: {
          toolbar: false,
          menubar: true,
          statusbar: false
        },

        _isReadOnly: false,

        _initElement: function() {
          $super._initElement.call(this);
          // Use this line if gbc should use the FGL richtext editor (only for 3.10)
          // this._richtextPath = gbc.WebComponentProxyService.getWebcomponentUrl() + "/fglrichtext/fglrichtext.html";
          this.setWebComponentType("api");
          this.setUrl(this._richtextPath);
          this._isReadOnly = false;
        },

        showEditToolBox: function(show) {
          if (this._isReady) {
            this._toICAPI("onProperty", {
              "showEditToolBox": show
            });
          } else {
            this.when(cls.WebComponentWidget.ready, function() {
              this._toICAPI("onProperty", {
                "showEditToolBox": show
              });
            }.bind(this));
          }
          this._toICAPI("onProperty", {
            "showEditToolBox": show
          });
        },

        _onReady: function() {
          $super._onReady.call(this);
          this._iframeElement.removeClass("hidden");
        },

        /**
         * @param {boolean} readonly true to set the widget as read-only, false otherwise
         */
        setReadOnly: function(readonly) {
          this._isReadOnly = readonly;

          if (this._isReady) {
            this._toICAPI("onProperty", {
              "disableEditor": readonly ? "disabled" : "enabled"
            });
          }
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly;
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);

          //disableEditor
          if (this._isReady) {
            this._toICAPI("onProperty", {
              "disableEditor": enabled ? "enabled" : "disabled"
            });
          } else {
            this.when(cls.WebComponentWidget.ready, function() {
              this._toICAPI("onProperty", {
                "disableEditor": enabled ? "enabled" : "disabled"
              });
            }.bind(this));
          }

        },

        /**
         * Set the value of the webComponent
         * @param value
         */
        setValue: function(value) {
          if (value === "") {
            value = null;
          }
          this._value = value;
          if (this._isReady) {
            this._toICAPI("onData", this._value ? this._value : "");
          } else {
            this.when(cls.WebComponentWidget.ready, this._onReadyData.bind(this));
          }
        },

        /**
         * When cursor2 === cursor, it is a simple cursor set
         * @param {int} cursor the selection range beginning
         * @param {int} cursor2 the selection range end, if any
         */
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            cursor2 = cursor;
          } else if (cursor2 === -1) {
            cursor2 = cursor;
          }
          //send cursor pos to tinymce (not supported)
          this._toICAPI("onProperty", {
            cursors: {
              cursor: cursor,
              cursor2: cursor2
            }
          });
        }

      };
    });
    cls.WidgetFactory.register('RichText', cls.RichTextWidget);
  });
