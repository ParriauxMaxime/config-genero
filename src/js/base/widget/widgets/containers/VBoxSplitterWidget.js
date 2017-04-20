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

modulum('VBoxSplitterWidget', ['SplitterWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Splitter widget.
     * @class classes.VBoxSplitterWidget
     * @extends classes.SplitterWidget
     */
    cls.VBoxSplitterWidget = context.oo.Class(cls.SplitterWidget, function($super) {
      /** @lends classes.VBoxSplitterWidget.prototype */
      return {
        __name: "VBoxSplitterWidget",
        __templateName: "SplitterWidget",
        _initElement: function() {
          $super._initElement.call(this);
          this._element.addClass("gbc_SplitterWidget");
        },
        _initLayout: function() {
          $super._initLayout.call(this);
          this._layoutInformation.setMaximal(cls.Size.undef, 8);
        },
        _onDragOver: function(evt) {
          $super._onDragOver.call(this, evt);
          this._pagePosition = evt.pageY;
        },
        _updateResizerDrag: function(evt) {
          this._pagePosition = evt.pageY;
          this._resizerDragPosition = evt.pageY;
        }
      };
    });
    cls.WidgetFactory.register('VBoxSplitter', cls.VBoxSplitterWidget);
  });
