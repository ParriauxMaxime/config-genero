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

modulum('PictureVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.PictureVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.PictureVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.PictureVMBehavior.prototype */
      return {
        __name: "PictureVMBehavior",

        watchedAttributes: {
          decorator: ['picture'],
          container: ['dialogType']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.getInput) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var containerNode = controller.getNodeBindings().container;
            var input = widget.getInput();
            if (decoratorNode && decoratorNode.isAttributesSetByVM('picture') && containerNode && containerNode.attribute(
                'dialogType') !== "Construct" && decoratorNode.attribute("picture").length > 0) {
              /* 1. Analyse picture and create rule (group) for each character of the mask */
              var mask = decoratorNode.attribute('picture');
              data.groups = [];

              for (var i = 0; i < mask.length; i++) {
                data.groups.push(this._createGroup(mask[i]));
              }

              /* 2. Call the widget custom Picture implementation if defined */
              if (widget.setPictureMask) {
                widget.setPictureMask(mask);
              }

              /* 3. Bind on all managed keyboard events */

              // Catch keypress event to update value if permitted by picture
              input.off('keypress.PictureVMBehavior');
              input.off('keydown.PictureVMBehavior');

              input.on('keypress.PictureVMBehavior', this._onPictureKeypress.bind(this, controller, data, input));
              input.on('keydown.PictureVMBehavior', this._onPictureKeydown.bind(this, controller, data, input));

              // Catch paste event to update value if it's respecting picture format
              input.off('paste.PictureVMBehavior');
              input.on('paste.PictureVMBehavior', this._onPicturePaste.bind(this, controller, data, input));

              // To disable text selection dragging
              input.off("dragstart.PictureVMBehavior");
              input.on("dragstart.PictureVMBehavior", this._onDragStart.bind(this));

              var keyboardInstance = context.keyboard(input);
              // Catch backspace event to move cursor according to separators and replace previous value by whitespace
              keyboardInstance.bind(['backspace'], this._onPictureBackspace.bind(this, controller, data, input));

              // Catch delete event to replace next character by whitespace if it's not a separator
              keyboardInstance.bind(['del'], this._onPictureDelete.bind(this, controller, data, input));

            } else {
              input.off('keypress.PictureVMBehavior');
              input.off('keydown.PictureVMBehavior');
              input.off('paste.PictureVMBehavior');
              input.off("dragstart.PictureVMBehavior");
              context.keyboard(input).unbind(['backspace', 'del']);
            }
          }
        },

        /**
         * Handle arrow left/right only and select the "block"
         * @param controller
         * @param data
         * @param input
         * @param event
         * @private
         */
        _onPictureKeydown: function(controller, data, input, event) {
          if ([37, 39].indexOf(event.which) >= 0) {
            var direction = event.which === 39; //true == right direction
            var value = input.value;
            var start = input.selectionStart;
            var cursor = direction ? this._getNextCursor(controller, data, value, start) : this._getPreviousCursor(controller, data,
              start);
            if (cursor) {
              input.setCursorPosition(cursor.start, cursor.start + 1);
            }
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
          }
        },

        _onPictureKeypress: function(controller, data, input, event) {
          if (event.which <= 0) // arrows key (for firefox)
          {
            return true;
          }

          // Get cursor positions
          var start = input.selectionStart;

          // start at first editable position from cursor position (editable group)
          while (data.groups[start] && !data.groups[start].isEditable) {
            start++;
          }
          // Validate current pressed key
          var currentGroup = data.groups[start];
          if (currentGroup && currentGroup.isValid) {
            var char = String.fromCharCode(event.which);
            var isValid = currentGroup.isValid(char);
            if (isValid) { // 2.3 Place cursor to new permitted position
              var value = input.value;
              input.value = (value.substr(0, start) + char + value.substr(start + 1));
              var cursor = this._getNextCursor(controller, data, value, start);
              input.setCursorPosition(cursor.start, cursor.end);
            }
          }
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();
          //return false;
        },

        _onPicturePaste: function(controller, data, input, e) { // paste
          var pastedText = null;
          // Get pasted value
          if (window.clipboardData && window.clipboardData.getData) { // IE
            pastedText = window.clipboardData.getData('Text');
          } else if (e.clipboardData && e.clipboardData.getData) {
            pastedText = e.clipboardData.getData('text/plain');
          }

          // Build new value till no conflict is met. when one conflict is met, take mask value for all remaining length.
          var newValue = "";
          var j = 0;
          var decoratorNode = controller.getNodeBindings().decorator;
          var mask = decoratorNode.attribute('picture');
          var pastedTextLength = pastedText.length;
          // Get cursor positions
          var start = input.selectionStart;
          var length = pastedTextLength; // loop length will depend of parsedText length. If parsedText length is higher than mask (data.groups), we take mask length

          var i = start;
          while (j < length) { // loop on each pastedText char from starting cursor position
            if (i === data.groups.length) { // end of editable zone
              break;
            }
            var group = data.groups[i];
            if (!group.isEditable) { // separator are kept intact --> copy them into new value
              var separator = mask[i];
              newValue += separator;
              if (separator === pastedText[j]) { // if current pasted char == current group seperator, we will not analyse it afterward
                j++;
              }
            } else { // current group is editable, check if current pasted char is valid
              var char = pastedText[j];
              if (group.isValid && group.isValid(char)) {
                // if previously no conflict met and current char is valid, we add it to new value
                newValue += char;
                j++;
              } else { // char is not valid, take mask value (whitespace since it's not a separator)
                break;
                //newValue += ' ';
              }
            }
            i++;
          }

          var existingValue = input.value;

          // Set input new value
          input.value = existingValue.substring(0, start) + newValue + existingValue.substring(start + newValue.length);
          input.setCursorPosition(i, i + 1);
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();
        },

        _onPictureBackspace: function(controller, data, input) {
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();

          var start = input.selectionStart;
          var stop = input.selectionEnd;
          var manyselected = stop - start > 1;

          var cursor = this._getPreviousCursor(controller, data, start);
          if (cursor || manyselected) {
            var value = input.value;

            // Correctly remove many char at the same time
            if (manyselected) {
              this._removeManyChars(data, input);
            } else {
              input.value = (value.substr(0, cursor.start) + ' ' + value.substr(cursor.start + 1));
              input.setCursorPosition(cursor.start, cursor.start + 1);
            }
          }

        },

        _onPictureDelete: function(controller, data, input) {
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();

          var start = input.selectionStart;
          var stop = input.selectionEnd;
          var value = input.value;

          var manyselected = stop - start > 1;
          if (manyselected) {
            this._removeManyChars(data, input);
          } else {
            if (start < value.length) {
              input.value = (value.substr(0, start) + ' ' + value.substr(start + 1));
              var cursor = this._getNextCursor(controller, data, value, start);
              input.setCursorPosition(cursor.start, cursor.end);
            }
          }
        },

        _onDragStart: function(event) {
          event.preventDefault();
        },

        _removeManyChars: function(data, input) {
          var value = input.value;
          var start = input.selectionStart;
          var stop = input.selectionEnd;

          var resultArray = value.split("");
          var tmpStart = start;

          while (data.groups.length > tmpStart && tmpStart !== stop) {
            if (data.groups[tmpStart].isEditable) {
              resultArray[tmpStart] = " ";
            }
            tmpStart++;
          }
          var jumpStart = 0;
          var jumpStop = 0;

          // Set the cursor correctly
          while (data.groups[start + jumpStart] && !data.groups[start + jumpStart].isEditable) {
            jumpStart++;
          }
          while (data.groups[stop + jumpStop - 1] && !data.groups[stop + jumpStop - 1].isEditable) {
            jumpStop++;
          }
          input.value = resultArray.join("");
          input.setCursorPosition(start + jumpStart, stop - jumpStop);
        },

        _getPreviousCursor: function(controller, data, ind) {
          if (ind === 0) {
            return null;
          }
          var start = ind;
          var jump = false;
          while (start > 0 && !data.groups[start - 1].isEditable) {
            jump = true;
            start--;
          }
          return {
            start: start - 1,
            jump: jump
          };
        },

        _getNextCursor: function(controller, data, value, ind) {
          var start = ind + 1;
          var jump = false;
          while (data.groups.length > start && !data.groups[start].isEditable) {
            jump = true;
            start++;
          }
          var end = start;
          if (start < value.length) {
            end = start + 1;
          }
          return {
            start: start,
            end: end,
            jump: jump
          };
        },

        _createGroup: function(type) {
          var group = {};
          switch (type) {
            case 'A': // Alpha numeric
              group.isEditable = true;
              group.isValid = cls.KeyboardHelper.isLetter;
              break;
            case '#': // Numeric only
              group.isEditable = true;
              group.isValid = cls.KeyboardHelper.isNumeric;
              break;
            case 'X': // All
              group.isEditable = true;
              group.isValid = function() {
                return true;
              };
              break;
            default: // Mask separator
              group.isEditable = false;
              group.isValid = null;
          }
          return group;
        }
      };
    });
  });
