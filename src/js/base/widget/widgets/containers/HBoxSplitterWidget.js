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

modulum('HBoxSplitterWidget', ['SplitterWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Splitter widget.
     * @class classes.HBoxSplitterWidget
     * @extends classes.SplitterWidget
     */
    cls.HBoxSplitterWidget = context.oo.Class(cls.SplitterWidget, function($super) {
      /** @lends classes.HBoxSplitterWidget.prototype */
      return {
        __name: "HBoxSplitterWidget",
        __templateName: "SplitterWidget",
        _initElement: function() {
          $super._initElement.call(this);
          this._element.addClass("gbc_SplitterWidget");
        },
        _initLayout: function() {
          $super._initLayout.call(this);
          this._layoutInformation.setMaximal(8, cls.Size.undef);
        },
        _onDragOver: function(evt) {
          $super._onDragOver.call(this, evt);
          this._pagePosition = evt.pageX;
        },
        _updateResizerDrag: function(evt) {
          this._pagePosition = evt.pageX;
          this._resizerDragPosition = evt.pageX;
        },
        updateSplits: function(delta) {
          if (this.isReversed()) {
            delta = -delta;
          }
          $super.updateSplits.call(this, delta);
        }
      };
    });
    cls.WidgetFactory.register('HBoxSplitter', cls.HBoxSplitterWidget);
  });
