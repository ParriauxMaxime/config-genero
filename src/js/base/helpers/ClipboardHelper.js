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

modulum('ClipboardHelper',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Helper to use clipboard
     * @class classes.KeyboardHelper
     */
    cls.ClipboardHelper = context.oo.StaticClass(function() {
      /** @lends classes.ClipboardHelper */
      return {
        __name: "ClipboardHelper",

        /**
         * Copy text to clipboard
         * Copies a string to the clipboard. Must be called from within an
         * event handler such as click. May return false if it failed, but
         * this is not always possible. Browser support for Chrome 43+,
         * Firefox 42+, Safari 10+, Edge and IE 10+.
         * IE: The clipboard feature may be disabled by an administrator. By
         * default a prompt is shown the first time the clipboard is
         * used (per session).
         * @param text text to copy
         * @param focusElement if !== null after copy the focus will be set on this element
         */
        copyTo: function(text, focusElement) {
          var useModalWindow = false;
          if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            window.clipboardData.setData("Text", text);

          } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
              var ret = document.execCommand("copy"); // Security exception may be thrown by some browsers
              useModalWindow = !ret;
            } catch (ex) {
              console.warn("Copy to clipboard failed.", ex);
            } finally {
              document.body.removeChild(textarea);
              if (!!focusElement) {
                focusElement.domFocus();
              }
            }
          }

          // Fallback if copy failed
          if (useModalWindow) {
            this._copyToUsingModal(text, focusElement);
          }
        },

        /** Use modal window with a textarea to copy to clipboard
         *
         * @param text text to copy
         * @param focusElement if !== null after copy the focus will be set on this element
         */
        _copyToUsingModal: function(text, focusElement) {

          var modal = cls.WidgetFactory.create("Modal");
          modal.setStyle(".mt-dialog-pane", {
            "width": "50%",
            "height": "50%"
          });

          modal.setClosable(true, true, true);

          var title = cls.WidgetFactory.create("Label");
          title.setValue("CTRL+C");

          var textarea = document.createElement("textarea");
          textarea.textContent = text;
          textarea.readOnly = true;
          textarea.style.width = "100%";

          textarea.on('keydown.ClipboardHelper', function(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            var char = String.fromCharCode(event.which || event.keyCode); // select all
            if (char.toLowerCase() === 'c' && (event.ctrlKey === true || event.metaKey === true)) {
              modal.destroy();
              if (!!focusElement) {
                focusElement.domFocus();
              }
            }
          }.bind(this));

          modal.setHeader(title.getElement());
          modal.setContent(textarea);

          document.body.appendChild(modal.getElement());
          modal.show();

          textarea.domFocus();
          textarea.select();
        }
      };
    });
  });
