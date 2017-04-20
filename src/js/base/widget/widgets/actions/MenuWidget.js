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

modulum('MenuWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Menu widget.
     * @class classes.MenuWidget
     * @extends classes.WidgetGroupBase
     */
    cls.MenuWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.MenuWidget.prototype */
      return {
        __name: "MenuWidget",
        /** @lends classes.MenuWidget */
        $static: {
          positionClass: {
            left: "gbc_WindowMenuContainerLeft",
            right: "gbc_WindowMenuContainerRight",
            top: "gbc_WindowMenuContainerTop",
            bottom: "gbc_WindowMenuContainerBottom"
          }
        },
        /**
         * @type Element
         */
        _textElement: null,
        _image: null,
        _modalWidget: null,
        _menuType: null,

        constructor: function() {
          $super.constructor.call(this);
          this._textElement = this._element.getElementsByClassName("gbc_MenuWidgetText")[0];
          // default orientation is vertical
          this._element.removeClass('gbc_MenuWidget_horizontal').addClass('gbc_MenuWidget_vertical');
        },

        destroy: function() {
          if (this._modalWidget) {
            if (this._modalWidget.hide) {
              this._modalWidget.hide();
              this._modalWidget.destroy();
              this._modalWidget = null;
            }
          }
          if (this._image) {
            this._image.destroy();
            this._image = null;
          }
          $super.destroy.call(this);
        },

        setText: function(text) {
          this._textElement.textContent = text;
        },

        getText: function() {
          return this._textElement.textContent;
        },

        setImage: function(image) {
          if (!this._image) {
            if (!image) {
              return;
            }
            this._image = cls.WidgetFactory.create("Image");
            this._element.getElementsByClassName("gbc_MenuWidgetTitle")[0].prependChild(this._image.getElement());
          }
          this._image.setSrc(image);
        },

        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        },
        /**
         * @param {string} title the tooltip text
         */
        setTitle: function(title) {
          this._element.setAttribute("title", title);
        },

        /**
         * @returns {string} the tooltip text
         */
        getTitle: function() {
          return this._element.getAttribute("title");
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          // if a menu get active and was previously hidden, it has to be displayed
          if (enabled && this.isHidden()) {
            this.setHidden(false);
          }
          // a modal or popup which gets disabled has to be hidden
          if (!enabled && this._modalWidget && this._modalWidget.isVisible() && (this.isModal() || this.isPopup())) {
            this._modalWidget.hide();
          }
        },

        /**
         * @param {string} orientation layout orientation. 'vertical' or 'horizontal'.
         */
        setOrientation: function(orientation) {
          if (this.getOrientation() !== orientation) {
            this._element.toggleClass('gbc_MenuWidget_horizontal', orientation !== "vertical");
            this._element.toggleClass('gbc_MenuWidget_vertical', orientation === "vertical");
          }
        },

        /**
         * @returns {string} the layout orientation. 'vertical' or 'horizontal'.
         */
        getOrientation: function() {
          if (this._element.hasClass('gbc_MenuWidget_vertical')) {
            return 'vertical';
          }
          return 'horizontal';
        },

        setHidden: function(hidden) {
          if (this._hidden !== hidden) {
            this._hidden = !!hidden;
            $super.setHidden.call(this, hidden);
            if (this._modalWidget) {
              if (this._hidden) {
                this._modalWidget.hide();
              } else {
                this._modalWidget.show();
              }
            }
          }
        },

        isPopup: function() {
          return this._menuType === "popup";
        },

        isModal: function() {
          return this._menuType === "dialog" || this._menuType === "winmsg"; // winmsg = fgldialog
        },

        /**
         * Defines the menu to be displayed as a modal one
         */
        setAsModal: function(modalType) {
          this._menuType = modalType;
          if (this.isPopup()) {
            this._modalWidget = cls.WidgetFactory.create("ChoiceDropDown");
            this._modalWidget.autoSize = false;
            this._modalWidget.setParentWidget(this);
            this._modalWidget.getElement().addClass("menu");

            for (var i = 0; i < this.getChildren().length; i++) {
              var child = this.getChildren()[i];
              this._modalWidget.addChildWidget(child);
            }
            //Place it at the middle center of the screen if menu opens automatically
            this._modalWidget.x = context.WidgetService.cursorX || "CENTER";
            this._modalWidget.y = context.WidgetService.cursorY || "CENTER";

            this._modalWidget.when(context.constants.widgetEvents.close, this._onClose.bind(this));

            this._modalWidget.show(true, true);
          } else if (this.isModal()) {
            var parentWidget = this.getParentWidget();
            if (!this._modalWidget) {
              this._modalWidget = cls.WidgetFactory.create("Modal");
              var parentNode = parentWidget.getElement();
              if (parentWidget.isModal) {
                parentNode = parentWidget.getModal().getElement().parentNode;
              }
              parentNode.appendChild(this._modalWidget.getElement());
            }

            if (!parentWidget || !parentWidget.getText || parentWidget.getText() !== this.getText()) {
              this._modalWidget.setHeader(this.getText());
            } else { // menu dialog with parent window of type popup : no title to add and hide window close button
              if (parentWidget.getModal) {
                var parentModal = parentWidget.getModal();
                if (parentModal) {
                  parentModal.setClosable(false);
                }
              }
            }
            this._modalWidget.setImage(this.getImage());
            this._modalWidget.setClosable(false);
            this._modalWidget.setContent(this.getTitle());
            this._modalWidget.setFooter(this.getElement());
            this._modalWidget.addClass('gbc_ModalMenuDialog');
            this.setOrientation("horizontal");
            this._element.addClass('gbc_ModalMenu');
            this._modalWidget.setStyle(".mt-dialog-content", {
              "white-space": "pre"
            });
            this._modalWidget.show();
          }
        },
        _onClose: function() {
          this.emit(context.constants.widgetEvents.close);
        },

        /**
         * actionPanelPosition (Dialog) + ringMenuPosition (Menu) 4ST attribute
         * @param position
         */
        setActionPanelPosition: function(position) {
          if (!this._menuType) {
            var windowMenuContainer = null;
            if (cls.MenuWidget.positionClass[position]) {
              windowMenuContainer = this.getParentWidget().getElement().getElementsByClassName(cls.MenuWidget.positionClass[
                position])[0];
              if (windowMenuContainer) {
                if (windowMenuContainer.firstChild !== this._element) {
                  if (windowMenuContainer.firstChild) {
                    windowMenuContainer.removeChild(windowMenuContainer.firstChild);
                  }
                  windowMenuContainer.appendChild(this._element);
                }
                windowMenuContainer.removeClass("hidden");
              }
            } else {
              this.setHidden(true);
            }
          }
        },

        hasFocus: function() {
          return true;
        }

      };
    });
    cls.WidgetFactory.register('Menu', cls.MenuWidget);
    cls.WidgetFactory.register('Dialog', cls.MenuWidget);
  });
