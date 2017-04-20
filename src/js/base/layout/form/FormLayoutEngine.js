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

modulum('FormLayoutEngine', ['LayoutEngineBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.FormLayoutEngine
     * @extends classes.LayoutEngineBase
     */
    cls.FormLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      /** @lends classes.FormLayoutEngine.prototype */
      return {
        __name: "FormLayoutEngine",
        _firstMeasure: true,
        measure: function() {
          var layoutInfo = this._getLayoutInfo();
          var element = this._widget.getElement();

          var isInModal = !!this._widget.getParentWidget().isModal;

          if (!isInModal) {
            layoutInfo.setMeasured(element.clientWidth - window.scrollBarSize, element.clientHeight - window.scrollBarSize);
          } else {
            var width = cls.CharSize.translate(layoutInfo.getMinSizeHint().getWidth(), layoutInfo.getCharSize().getWidthM(),
              layoutInfo.getCharSize().getWidth0());
            var height = cls.Size.translate(layoutInfo.getMinSizeHint().getHeight(), layoutInfo.getCharSize().getHeight());

            layoutInfo.setMeasured(width, height);
          }
          var childInfo = this._getLayoutInfo(this._widget.getChildren()[0]);
          if (childInfo) {
            var measured = layoutInfo.getMeasured();
            if (!isInModal) {
              childInfo.setAvailable(measured.getWidth(), measured.getHeight(), true);
            }
          }
        },
        ajust: function(lastInvalidated, layoutApplicationService) {
          var isInModal = !!this._widget.getParentWidget().isModal;

          var layoutInfo = this._getLayoutInfo();
          var childInfo = this._getLayoutInfo(this._widget.getChildren()[0]);
          if (isInModal) {
            var childMeasured = childInfo.getMeasured();
            var formMeasured = this._getLayoutInfo().getMeasured();
            childInfo.setAvailable(Math.max(childMeasured.getWidth(), formMeasured.getWidth()), Math.max(childMeasured.getHeight(),
              formMeasured.getHeight()), true);
          }
          if (childInfo) {
            var measured = layoutInfo.getMeasured();
            if (!isInModal) {
              childInfo.setAvailable(measured.getWidth(), measured.getHeight(), true);
              var minimal = childInfo.getMinimal();
              if (minimal.getHeight(true) > measured.getHeight(true)) {
                if (this._firstMeasure) {
                  layoutApplicationService.activateAutoOverflow();
                }
              }
            }
          }
          this._firstMeasure = false;
        },
        apply: function() {
          var isInModal = !!this._widget.getParentWidget().isModal;

          if (isInModal) {
            var childInfo = this._getLayoutInfo(this._widget.getChildren()[0]);
            var measured = childInfo.getAllocated();
            var style = {};
            style[".g_measured .gbc_ModalWidget #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
              width: cls.Size.cachedPxImportant(measured.getWidth() + window.scrollBarSize),
              height: cls.Size.cachedPxImportant(measured.getHeight() + window.scrollBarSize)
            };
            styler.appendStyleSheet(style, "formLayout_" + this._widget.getUniqueIdentifier());
            var parentWidget = this._widget.getParentWidget();
            if (parentWidget && parentWidget._modalWidget && parentWidget._modalWidget.setHeaderMaxWidth) {
              parentWidget._modalWidget.setHeaderMaxWidth(measured.getWidth() + window.scrollBarSize);
            }
          }
        },
        notify: function() {
          $super.notify.call(this);
          window.requestAnimationFrame(this._onNotified.bind(this));
        },

        _charMeasured: false,

        measureChar: function() {
          if (!this._charMeasured) {
            var MMMlen = this._widget.__charMeasurer1.getBoundingClientRect(),
              _000len = this._widget.__charMeasurer2.getBoundingClientRect();
            this._getLayoutInfo().setCharSize(MMMlen.width / 10, _000len.width / 10, MMMlen.height / 10);
            if (_000len.width > 0 && MMMlen.height > 0) {
              this._charMeasured = true;
            }
          }
        },

        _onNotified: function() {
          var widget = this._widget,
            style = {};
          if (!!widget) {
            var isInModal = !!this._widget.getParentWidget().isModal;
            if (isInModal) {
              var modal = this._widget.getElement().parent("gbc_ModalWidget"),
                modalpane = modal.child("mt-dialog-pane"),
                modalcontent = modalpane.child("mt-dialog-content");
              var deltaWidth = modalpane.offsetWidth - modal.offsetWidth;
              var deltaHeight = modalpane.offsetHeight - modal.offsetHeight;
              if (window.browserInfo.isSafari) {
                this._widget.getElement().addClass("safariMeasure");
              }
              var firstChild = widget.getChildren()[0],
                childMeasure = firstChild && firstChild.getLayoutInformation() &&
                firstChild.getLayoutInformation().getMeasured();
              widget.getLayoutInformation().setMeasured(
                childMeasure && childMeasure.getWidth() || (widget.getElement().clientWidth - (deltaWidth > 0 ? deltaWidth : 0)),
                childMeasure && childMeasure.getHeight() || (widget.getElement().clientHeight - (deltaHeight > 0 ? deltaHeight :
                  0))
              );
              if (window.browserInfo.isSafari) {
                this._widget.getElement().removeClass("safariMeasure");
              }
              var _measured = widget.getLayoutInformation().getMeasured();

              if (this._widget._parentWidget._toolBarWidget) {
                this._widget._parentWidget._toolBarWidget.setStyle({
                  "width": childMeasure.getWidth() + "px"
                });
              }

              var modalContentWidth = modalcontent.offsetWidth,
                modalContentHeight = modalcontent.offsetHeight,
                overflowX = (Math.floor(_measured.getWidth()) + window.scrollBarSize) > (modalContentWidth),
                overflowY = (Math.floor(_measured.getHeight()) + window.scrollBarSize) > (modalContentHeight),
                overflowXClass = (overflowY && overflowX) || (Math.floor(_measured.getWidth())) > (modalContentWidth),
                overflowYClass = (overflowY && overflowX) || (Math.floor(_measured.getHeight())) > (modalContentHeight);
              style[".g_measured .gbc_ModalWidget #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
                width: cls.Size.cachedPxImportant(overflowX ? modalContentWidth : _measured.getWidth() + window.scrollBarSize),
                height: cls.Size.cachedPxImportant(overflowY ? modalContentHeight : _measured.getHeight() + window.scrollBarSize)
              };
              styler.appendStyleSheet(style, "formLayout_" + this._widget.getUniqueIdentifier());

              widget.getElement()
                .toggleClass("overflownX", overflowXClass)
                .toggleClass("overflownY", overflowYClass);
            } else {
              if (widget.getWindowWidget() && !widget.getWindowWidget()._disabled) {
                var element = widget.getElement(),
                  measured = widget.getLayoutInformation().getMeasured(),
                  childAllocated = widget.getChildren()[0].getLayoutInformation().getAllocated(),
                  dWidth = measured.getWidth() - childAllocated.getWidth(),
                  dHeight = measured.getHeight() - childAllocated.getHeight();
                style["#w_" + this._widget.getUniqueIdentifier() + ".g_measureable>.containerElement>*"] = {
                  width: cls.Size.cachedPxImportant(childAllocated.getWidth()),
                  height: cls.Size.cachedPxImportant(childAllocated.getHeight())
                };
                styler.appendStyleSheet(style, "formLayout_" + this._widget.getUniqueIdentifier());

                element.toggleClass("overflownX", dWidth < -0.9).toggleClass("overflownY", dHeight < -0.9);
              }
            }
          }
        },
        invalidateMeasure: function(invalidation) {
          var invalidated = !invalidation || this._invalidatedMeasure < invalidation;
          $super.invalidateMeasure.call(this, invalidation);
          if (invalidated) {
            this.invalidateAllocatedSpace(this._invalidatedMeasure);
          }
        },

        invalidateAllocatedSpace: function(invalidation) {
          var invalidated = !invalidation || this._invalidatedAllocatedSpace < invalidation;
          $super.invalidateAllocatedSpace.call(this, invalidation);
          if (invalidated) {
            this.invalidateMeasure(this._invalidatedAllocatedSpace);
          }
        },

        needMeasureSwitching: Function.false,

        needMeasure: Function.true
      };
    });
  });
