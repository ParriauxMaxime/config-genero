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

modulum('DropDownWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * DropDown widget.
     * @class classes.DropDownWidget
     * @extends classes.WidgetGroupBase
     */
    cls.DropDownWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.DropDownWidget.prototype */
      return {
        __name: "DropDownWidget",
        /**
         * Indicate if a request is coming from user or only from VM.
         * Important to avoid dropdown display when going from display to input mode
         */
        _userClick: false,
        autoSize: false,
        alignToLeft: true,
        x: null,
        y: null,
        width: null,
        _closeHandler: null,
        _blurHandler: null,

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._closeHandler = this.when(context.constants.widgetEvents.close, function() {
            if (this.onClose) {
              this.onClose();
            }
          }.bind(this));
        },

        destroy: function() {
          if (this.getElement()) {
            context.keyboard.release(this.getElement());
          }
          if (this.isVisible()) {
            this._show(false);
          }
          this._closeHandler();
          this.unbindBlur();
          for (var i = this.getChildren().length - 1; i > -1; i--) {
            var currentChildren = this.getChildren()[i];
            currentChildren.destroy();
            currentChildren = null;
          }
          if (this._parentWidget && this._parentWidget.removeChildWidget) {
            this._parentWidget.removeChildWidget(this);
          }
          this._parentWidget = null;
          $super.destroy.call(this);
        },

        setParentWidget: function(widget) {
          $super.setParentWidget.call(this, widget);
          if (widget) {
            var keyboardInstance = context.keyboard(widget.getElement());
            keyboardInstance.bind(['tab'], function(event) {
              if (this.isVisible()) {
                //event.stopPropagation();
                this.show(false);
              }
            }.bind(this));
            keyboardInstance.bind(['shift+tab'], function(event) {
              if (this.isVisible()) {
                //event.stopPropagation();
                this.show(false);
              }
            }.bind(this));
            keyboardInstance.bind(['esc'], function(event) {
              if (this.isVisible()) {
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();
                this.show(false);
              }
            }.bind(this));
            keyboardInstance.bind(['enter'], function(event) {
              if (this.isVisible()) {
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();
                this.show(false);

              }
            }.bind(this));
          }
        },
        _blurClick: function(event) {
          // if neither widget and dropdown container contains clicked element, we close dropdown
          if (this.getParentWidget() && this.getParentWidget().getElement() && !this.getParentWidget().getElement().contains(
              event.target) && !context.DropDownService.getCurrentContainer().getElement().contains(event.target)) {
            this.unbindBlur();
            this._show(false);
            this.getParentWidget().emit(context.constants.widgetEvents.blur, event);
          }
        },

        unbindBlur: function() {
          document.body.off("click.DropDownWidget");
          if (this._blurHandler) {
            document.removeEventListener("scroll", this._blurHandler);
            this._blurHandler = null;
          }
        },

        bindBlur: function() {
          document.body.off("click.DropDownWidget");
          if (this._blurHandler) {
            document.removeEventListener("scroll", this._blurHandler);
          }

          this._blurHandler = this._blurClick.bind(this);
          document.body.on("click.DropDownWidget", this._blurHandler);
          document.addEventListener("scroll", this._blurHandler, true);

        },

        /**
         * Show/Hide dropdown and bind single live close event when clicking outside of dropdown
         * @param {Boolean} visible
         * @private
         */
        _show: function(visible) {
          if (visible) {
            this.bindBlur();
            if (this.onOpen) {
              this.onOpen();
            }
          } else {
            if (this.onClose) {
              this.onClose();
            }
            this._userClick = false;
          }

          context.DropDownService.showDropDown(this.getParentWidget(), this, visible);
        },

        /**
         * Should only be called by DropDownService.
         */
        resetUserClick: function() {
          this._userClick = false;
        },

        hide: function() {
          this._userClick = false;
          context.DropDownService.showDropDown(this.getParentWidget(), this, false);
        },

        /**
         * To call when an external widget wants to show/hide its dropdown.
         * @param {Boolean} visible
         * @param {Boolean} userClick, indicates if request is made by user or not. If not, dropdown won't be displayed.
         * @returns {Boolean} forceDisplay, true if dropdown as been displayed.
         */
        show: function(visible, userClick, forceDisplay) {
          var isDisplayed = false;
          var parent = this.getParentWidget();
          if (!visible) {
            if (!this.isVisible()) {
              return isDisplayed;
            }
            this._show(false);
          } else if (parent.isEnabled() && !this.isVisible()) {
            if (parent.hasFocus() === true || forceDisplay) { /* Field receive VM focus */
              if (userClick === true) {
                this._userClick = true;
              }
              if (this._userClick === true) {
                isDisplayed = true;
                this._show(true);
              } else {
                /* When switching of field without clicking, new focused field doesn't have to open picker
                 Otherwise, it has to close previous picker because a new field has been focused.
                 */
                context.DropDownService.removeDropDowns();
              }
            } else {
              this._userClick = true;
              parent.emit(context.constants.widgetEvents.requestFocus);
            }
          }
          return isDisplayed;
        },

        onOpen: function() {

        },

        onClose: function() {

        },

        /**
         * Toggle dropdown display
         * @returns {*|Boolean}
         */
        toggle: function(forceDisplay) {
          return this.show(!this.isVisible(), true, forceDisplay);
        },

        /**
         *
         * @returns {boolean}
         */
        isVisible: function() {
          return context.DropDownService.isDropDownVisible(this);
        },

        focus: function() {
          this._element.focus();
        },

        /**
         *
         * @param enabled
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._show(false);
        }

      };
    });
    cls.WidgetFactory.register('DropDown', cls.DropDownWidget);
  });
