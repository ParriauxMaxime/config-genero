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

modulum('ApplicationHostMenuRunInGdcWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuRunInGdcWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuRunInGdcWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuRunInGdcWidget.prototype */
      return {
        __name: "ApplicationHostMenuRunInGdcWidget",
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          context.DebugService.registerDebugUi(this);
        },
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.on("click.ApplicationHostMenuRunInGdcWidget", this._onClick.bind(this));
        },
        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          context.DebugService.unregisterDebugUi(this);
          this._element.off("click.ApplicationHostMenuRunInGdcWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          var name = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);
          var shortcut = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<fjs configVersion="2" product="Genero Desktop Client">\n' +
            ' <Shortcuts>\n' +
            '  <Shortcut ' +
            'name="' + name + '" ' +
            'authenticationMode="standard" ' +
            'type="http" ' +
            'proxyType="monitor" ' +
            'url="' + window.location.href + '" ' +
            '/>\n' +
            ' </Shortcuts>\n' +
            '</fjs>';

          var shortcutFile = new Blob([shortcut], {
            type: "application/genero-gdc"
          });
          var a = document.createElement("a");
          a.style = "display: none";
          document.body.appendChild(a);
          a.href = window.URL.createObjectURL(shortcutFile);
          a.download = name + ".gdc";
          a.click();
          document.body.removeChild(a);
        },
        activate: function(active) {
          this._element.toggleClass("debugActivated", active);
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostMenuRunInGdc', cls.ApplicationHostMenuRunInGdcWidget);
  });
