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

modulum('SplitterWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Splitter widget.
     * @class classes.SplitterWidget
     * @extends classes.WidgetBase
     */
    cls.SplitterWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.SplitterWidget.prototype */
      return {
        __name: "SplitterWidget",

        _canSplit: false,
        _pagePosition: 0,
        _resizerDragPosition: 0,
        _isDragging: false,
        _splitInfo: null,
        _dragHandle: null,
        _forcedDefault: false,
        _splitterId: {},
        /**
         * @type Element
         */
        _splitHolder: null,

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
          this._layoutInformation.setMaximal(8, 8);
          this._layoutInformation.setMinimal(8, 8);
          this._layoutInformation.setMeasured(8, 8);
        },

        _initElement: function() {
          $super._initElement.call(this);
          // This is a really ugly hack to avoid firefox to display unwanted shitty icon
          this._dragHandle = this._element.getElementsByClassName("firefox_placekeeper")[0];
          this._element.setAttribute("draggable", "true");
          this._element.on("dragstart.SplitterWidget", this._onDragStart.bind(this));
          this._element.on("dragend.SplitterWidget", this._onDragEnd.bind(this));
          this._element.on("drag.SplitterWidget", this._onDrag.bind(this));
          if (window.browserInfo.isIE || window.browserInfo.isEdge) {
            this._element.on("mousedown.SplitterWidget", function() {
              this._element.style.opacity = 0;
            }.bind(this));
            this._element.on("mouseup.SplitterWidget", function() {
              this._element.style.opacity = "";
            }.bind(this));
          }
          this._splitHolder = document.createElement("div");
          this._splitHolder.className = "gbc_SplitterWidget_splitholder";
        },
        destroy: function() {
          this._element.off("dragstart.SplitterWidget");
          this._element.off("dragend.SplitterWidget");
          this._element.off("drag.SplitterWidget");
          if (window.browserInfo.isIE || window.browserInfo.isEdge) {
            this._element.off("mousedown.SplitterWidget");
            this._element.off("mouseup.SplitterWidget");
          }
          $super.destroy.call(this);

        },
        _onDragOver: function(evt) {
          evt.preventDefault();
        },
        _onDragStart: function(evt) {
          if (this._canSplit) {
            this._element.parentNode.style.zIndex = 99999;
            this._splitHolder.style.zIndex = 99998;
            this._splitHolder.style.display = "block";
            this.getParentWidget().getElement().on("dragover.SplitterWidget", this._onDragOver.bind(this));
            this._splitHolder.on("dragover.SplitterWidget", this._onDragOver.bind(this));
            this._isDragging = true;
            if (window.browserInfo.isFirefox) {
              evt.dataTransfer.setData('text', ''); // for Firefox compatibility
            }
            if (evt.dataTransfer.setDragImage) {
              evt.dataTransfer.setDragImage(this._dragHandle, 0, 0);
            }
            evt.dataTransfer.effectAllowed = "move";
            this._updateResizerDrag(evt);
            this.emit(context.constants.widgetEvents.splitterStart);
          } else {
            evt.preventDefault();
          }
          return false;
        },
        _updateResizerDrag: function(evt) {

        },
        _onDragEnd: function(evt) {
          this._element.style.zIndex = "";
          this._splitHolder.style.zIndex = "";
          this._splitHolder.style.display = "";
          this._splitHolder.off("dragover.SplitterWidget");
          this.getParentWidget().getElement().off("dragover.SplitterWidget");
          this._isDragging = false;
          if (window.browserInfo.isIE || window.browserInfo.isEdge) {
            this._element.style.opacity = "";
          }
          this.emit(context.constants.widgetEvents.splitterEnd);
        },
        _onDrag: function(evt) {
          if (this._isDragging) {
            var delta = this._pagePosition - this._resizerDragPosition;
            this.updateSplits(delta);
          }
        },

        _setDOMAttachedOrDetached: function() {
          if (this._element.parentNode) {
            this._element.parentNode.parentNode.appendChild(this._splitHolder);
          } else {
            this._splitHolder.remove();
          }
        },
        activateSplitter: function(canSplit) {
          this._canSplit = !!canSplit;
          this._element.toggleClass("canSplit", !!canSplit);
        },
        isReversed: function() {
          return this._parentWidget.isReversed();
        },
        updateSplits: function(delta) {
          if (!Number.isNaN(delta)) {
            this.emit(context.constants.widgetEvents.splitter, delta);
          }
        }
      };
    });
    cls.WidgetFactory.register('Splitter', cls.SplitterWidget);
  });
