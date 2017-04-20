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

modulum('ApplicationHostMenuAboutWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuAboutWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuAboutWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuAboutWidget.prototype */
      return {
        __name: "ApplicationHostMenuAboutWidget",
        /**
         * @type {classes.ApplicationHostAboutWidget}
         */
        _aboutModal: null,
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.setAttribute('title', "GBC " + context.version);
          this._element.on("click.ApplicationHostMenuAboutWidget", this._onClick.bind(this));
        },

        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          this._element.off("click.ApplicationHostMenuAboutWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          if (this._aboutModal === null) {
            this._aboutModal = cls.WidgetFactory.create('ApplicationHostAbout');
            document.body.appendChild(this._aboutModal.getElement());
            this._aboutModal.when(context.constants.widgetEvents.close, function() {
              this._aboutModal.destroy();
              this._aboutModal = null;
            }.bind(this));
          }
          this._aboutModal.show();
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostAboutMenu', cls.ApplicationHostMenuAboutWidget);
  });
