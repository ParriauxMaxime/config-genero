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

modulum('StartMenuGroupWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * StartMenuGroup widget.
     * @class classes.StartMenuGroupWidget
     * @extends classes.WidgetGroupBase
     */
    cls.StartMenuGroupWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.StartMenuGroupWidget.prototype */
      return {
        __name: "StartMenuGroupWidget",

        _image: null,
        /**
         * @type {Element}
         */
        _groupTitle: null,

        _initElement: function() {
          $super._initElement.call(this);
          this._groupTitle = this._element.getElementsByClassName("gbc_startMenuGroupTitle")[0];
          this._groupTitle.on('click.StartMenuGroupWidget', this._onToggleClick.bind(this));
        },

        destroy: function() {
          this._groupTitle.off('click.StartMenuGroupWidget');
          if (this._image) {
            this._image.destroy();
            this._image = null;

          }
          $super.destroy.call(this);
        },

        _onToggleClick: function(event) {
          this._element.classList.toggle('gbc_open');
        },
        setText: function(text) {
          this._element.getElementsByClassName("gbc_startMenuGroupTitleText")[0].textContent = text;
        },

        getText: function() {
          return this._element.getElementsByClassName("gbc_startMenuGroupTitleText")[0].textContent;
        },

        setImage: function(image) {
          if (image.length !== 0) {
            if (!this._image) {
              this._image = cls.WidgetFactory.create("Image");
              this._element.child("gbc_startMenuGroupTitle").prependChild(this._image.getElement());
            }
            this._image.setSrc(image);
          }
        },

        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        }
      };
    });
    cls.WidgetFactory.register('StartMenuGroup', cls.StartMenuGroupWidget);
  });
