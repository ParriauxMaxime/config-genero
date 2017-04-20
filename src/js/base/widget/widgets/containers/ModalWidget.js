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

modulum('ModalWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Modal widget.
     * @class classes.ModalWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ModalWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ModalWidget.prototype */
      return {
        __name: "ModalWidget",
        /**
         * @type {Element}
         */
        _header: null,
        /**
         * @type {Element}
         */
        _footer: null,
        /**
         * @type {Element}
         */
        _title: null,
        _uiWidget: null,
        /**
         * @type {Element}
         */
        _dialogPane: null,
        _initialRects: null,
        _moved: false,
        _bounds: {},
        _viewRect: {},
        /**
         * @type {Element}
         */
        _actionsHost: null,
        /**
         * @type {Element}
         */
        _closeButton: null,

        _displayed: false,
        _systemModal: false,

        _initElement: function() {
          $super._initElement.call(this);
          this._header = this._element.getElementsByClassName('mt-dialog-header')[0];
          this._header.toggleClass("hidden", false);
          this._footer = this._element.getElementsByClassName('mt-dialog-footer')[0];
          this._title = this._header.getElementsByClassName('mt-dialog-title')[0];
          this._actionsHost = this._header.getElementsByClassName('mt-dialog-actions')[0];
          this._dialogPane = this._element.querySelector(".mt-dialog-pane");
          this._closeButton = this._actionsHost.getElementsByClassName('close')[0];
          this._closeButton.on("click.ModalWidget", function() {
            this.emit(context.constants.widgetEvents.close);
          }.bind(this));
          this._element.on("click.ModalWidget", function(evt) {
            if (evt.target === evt.currentTarget) {
              this.emit(context.constants.widgetEvents.modalOut);
            }
          }.bind(this));
        },

        destroy: function() {
          this.hide();
          this._closeButton.off("click.ModalWidget");
          if (this._element) {
            this._element.off("click.ModalWidget");
            this._element.off("keydown.ModalWidget");
          }
          if (this._image) {
            this._image.destroy();
            this._image = null;
          }
          $super.destroy.call(this);
        },

        /**
         * Set that the modal is only for GBC
         */
        _gbcSystemModal: function() {
          this._systemModal = true;
          this._element.setAttribute("tabindex", "0");
          this._element.domFocus();
          // do not propagate key event  to avoid sending them to VM
          this._element.on("keydown.ModalWidget", function(evt) {
            evt.stopPropagation();
          }.bind(this));
        },

        /**
         * @param {string|Element|jQuery} header the header
         */
        setHeader: function(header) {
          if (Object.isString(header)) {
            this._header.toggleClass("hidden", header.length === 0);
            this._title.textContent = header;
          } else {
            this._title.empty();
            if (header) {
              this._title.appendChild(header);
            }
          }
        },

        setImage: function(image) {
          if (!!image && image !== "") {
            if (!this._image) {
              this._image = cls.WidgetFactory.create("Image");
              this._title.parentNode.insertBefore(this._image.getElement(), this._title);
            }
            this._image.setSrc(image);
          }
        },

        /**
         * @param {string|Element|jQuery} header the footer
         */
        setFooter: function(footer) {
          if (Object.isString(footer)) {
            this._footer.textContent = footer;
          } else {
            this._footer.empty();
            if (footer) {
              this._footer.appendChild(footer);
            }
          }
        },

        /**
         * @param {string|Element|jQuery} header the content
         */
        setContent: function(content) {
          if (Object.isString(content)) {
            this._containerElement.textContent = content;
          } else {
            // Setting this._containerElement.innerHTML = "" can cause unwanted cleaning under IE11. In our case content.innerHTML gets cleaned (GBC-727). Prefer cleaning by looping on children
            this._containerElement.empty();
            if (content) {
              this._containerElement.appendChild(content);
            }
          }
        },

        /**
         * @param {boolean} closable true if the dialog is closable, false otherwise
         * @param {boolean] directlyHide true if the dialog should be directly hidden when colse button clicked
         * @param {boolean] hideOnClickOut true if dialg should be hidden when user click outside of modal
         */
        setClosable: function(closable, directlyHide, hideOnClickOut) {
          if (closable) {
            this._closeButton.removeClass("hidden");
          } else {
            this._closeButton.addClass("hidden");
          }

          if (directlyHide) {
            this._closeButton.on("click.ModalWidget", function() {
              this.hide();
            }.bind(this));
          }
          if (hideOnClickOut) {
            this._element.on("click.ModalWidget", function(evt) {
              if (evt.target === evt.currentTarget) {
                this.hide();
              }
            }.bind(this));
          }
        },

        /**
         * @returns {boolean} true if the dialog is closable, false otherwise
         */
        getClosable: function() {
          return this._closeButton.hasClass('hidden');
        },

        setUiWidget: function(uiWidget) {
          this._uiWidget = uiWidget;
        },

        show: function() {

          if (this._element) {
            this._element.addClass("displayed");
            this.setMovable(true);
            this._initViewRect();
          }
          this._displayed = true;

          if (this._systemModal) {
            this._element.domFocus();
          }
        },
        hide: function() {
          if (this._element && this.isVisible()) {
            this._element.removeClass("displayed");
            this._displayed = false;
            this.setMovable(false); // DEBUG
            this._initialRects = null;
            this._moved = false;
            this.emit(context.constants.widgetEvents.close);
          }
        },
        isVisible: function() {
          return this._displayed;
        },
        onClose: function(hook) {
          this.when(context.constants.widgetEvents.close, hook);
        },

        setHeaderMaxWidth: function(width) {
          //this.setStyle(".mt-dialog-title", {
          this.setStyle(".mt-dialog-header", {
            "max-width": width + 'px'
          });
        },

        /**
         * Make the modal window movable
         * @param movable
         */
        setMovable: function(movable) {
          if (movable) {
            this.addClass("movable");
            this._header.on('mousedown', this._drag.bind(this));
            this._modalLayoutChangedHandler();
          } else {
            this._header.off('mousemove.ModalWidgetMovable');
            this._header.off('mousedown');
            this._element.off('mouseleave.ModalWidgetMovable');
            this._element.off('mousemove.ModalWidgetMovable');
            this._dialogPane.style.zIndex = 1;
            this._dialogPane.style.top = "";
            this._dialogPane.style.left = "";
            this.removeClass("moving");
          }
        },

        /**
         * Call this if you need to synchronize the view Rect
         * @private
         */
        _initViewRect: function() {
          if (this._uiWidget) {
            this._viewRect = {
              width: this._uiWidget._element.clientWidth,
              height: this._uiWidget._element.clientHeight,
            };
          }
        },

        /**
         * Function called when mousdown : start the dragging routine
         * @param event
         * @private
         */
        _drag: function(event) {
          if (event.button !== 0 && event.which !== 1) {
            return false;
          }

          // Prevent mouse selection
          this.addClass("noselect");

          // Reinit the Panel dimensions/positions if it hasn't moved yet
          if (!this._moved) {
            var dialogClientRect = this._dialogPane.getClientRects()[0];
            this._initialRects = {
              left: this._dialogPane.offsetLeft,
              top: this._dialogPane.offsetTop,
              bottom: this._dialogPane.offsetTop,
              right: this._dialogPane.offsetLeft,
              height: dialogClientRect.height,
              width: dialogClientRect.width
            };
            this._moved = true;
          }
          this._buttonDown = true;

          var initialClientY = event.clientY,
            initialClientX = event.clientX,
            lastPosX = Number(this._dialogPane.style.left.replace('px', '')) || 0,
            lastPosY = Number(this._dialogPane.style.top.replace('px', '')) || 0,

            /**
             * Reset events
             */
            removeBindings = function() {
              this._header.off('mousemove.ModalWidgetMovable');
              this._header.off('mouseup.ModalWidgetMovable');
              this._element.off('mouseleave.ModalWidgetMovable');
              this._element.off('mousemove.ModalWidgetMovable');
              this._element.off('mouseup.ModalWidgetMovable');
              this._dialogPane.style.zIndex = 1;
              this.removeClass("moving");
              this.removeClass("noselect");
              this._buttonDown = false;

            },

            /**
             * Check if element is in the view
             * @param elem
             * @param {number} padding to apply when checking
             * @returns {boolean} true if in view else otherwise
             */
            inView = function(parentRect, elemRect, padding) {
              padding = padding ? padding : 0;
              return parentRect.right - padding > elemRect.right &&
                parentRect.left + padding < elemRect.left &&
                parentRect.top - padding < elemRect.top &&
                parentRect.bottom + padding > elemRect.bottom;
            },

            /**
             * Moving the mouse
             * @param t event
             */
            xy = function(t) {
              var border = 2;
              if (this._buttonDown) {

                this.addClass("moving");

                var moveToY = t.clientY - initialClientY,
                  moveToX = t.clientX - initialClientX,
                  top = lastPosY + moveToY,
                  left = lastPosX + moveToX;

                // Out of View ? Handle bounds to know the limits of the view
                var parentContainer = null;
                if (this.getUserInterfaceWidget()) {
                  parentContainer = this.getUserInterfaceWidget().getContainerElement();
                } else {
                  parentContainer = document.querySelector(".mt-centralcontainer-content");
                }
                var parentRect = parentContainer.getClientRects()[0];
                var dialogRect = this._dialogPane.getClientRects()[0];
                if (!inView(parentRect, dialogRect, 0)) {
                  //top
                  if (this._dialogPane.offsetTop < parentRect.top) {
                    this._bounds.top = this._initialRects.top - border;
                  }
                  //right
                  if (this._dialogPane.offsetLeft + this._initialRects.width >= parentRect.width - 5) {
                    this._bounds.right = this._initialRects.left - border;
                  }
                  //bottom
                  if (this._dialogPane.offsetTop + this._initialRects.height >= parentRect.height - 5) {
                    this._bounds.bottom = this._initialRects.top - border;
                  }
                  //left
                  if (this._dialogPane.offsetLeft < parentRect.left) {
                    this._bounds.left = -this._initialRects.left - border;
                  }
                }

                if (left < 0) {
                  // Going Left
                  left = Math.abs(left) > Math.abs(this._bounds.left) ? this._bounds.left : left;
                } else if (left > 0) {
                  // Going Right
                  left = Math.abs(left) > Math.abs(this._bounds.right) ? this._bounds.right : left;
                }
                if (top > 0) {
                  // Going Down
                  top = Math.abs(top) > Math.abs(this._bounds.bottom) ? this._bounds.bottom : top;
                } else if (top < 0) {
                  // Going Up
                  top = Math.abs(top) > Math.abs(this._bounds.top) ? -this._bounds.top : top;
                }

                this.addClass("moving");
                this._dialogPane.style.top = top + 'px';
                this._dialogPane.style.left = left + 'px';
                this._dialogPane.style.zIndex = 9999;
              }
            };

          // Add events on different elements
          this._element.on('mousemove.ModalWidgetMovable', xy.bind(this));
          this._element.on('mouseleave.ModalWidgetMovable', removeBindings.bind(this));
          this._element.on('mouseup.ModalWidgetMovable', removeBindings.bind(this));
          this._header.on('mouseup', removeBindings.bind(this));
        },

        /**
         * Handle a change in the way of displaying the modal
         * @protected
         */
        _modalLayoutChangedHandler: function() {
          if (this._uiWidget && this._uiWidget._layoutEngine) {
            this._uiWidget._layoutEngine.onLayoutApplied(function() {

              // Reset modal position if viewport has changed
              if (this._viewRect.width !== this._uiWidget._element.clientWidth || this._viewRect.height !== this._uiWidget._element
                .clientHeight) {
                this._dialogPane.style.top = "";
                this._dialogPane.style.left = "";
                // will force modal remeasure
                this._moved = false;
                this._bounds = {};

                this._initViewRect();
              }
            }.bind(this));
          }
        }
      };
    });
    cls.WidgetFactory.register('Modal', cls.ModalWidget);
  });
