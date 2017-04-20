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

modulum('MonitorDebugTreeItemWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.MonitorDebugTreeItemWidget
     * @extends classes.WidgetGroupBase
     */
    cls.MonitorDebugTreeItemWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.MonitorDebugTreeItemWidget.prototype */
      return {
        __name: "MonitorDebugTreeItemWidget",
        _container: null,
        _label: null,
        _idRef: null,
        _idRefNumber: null,
        _collapsed: false,
        _initElement: function() {
          $super._initElement.call(this);
          this._container = this._element.child("description");
          this._label = this._container.child("label");
          this._idRef = this._container.child("idRef");
          this._container
            .on("click.MonitorDebugTreeItemWidget", this._onClick.bind(this))
            .on("dblclick.MonitorDebugTreeItemWidget", this._onDoubleClick.bind(this));

        },
        destroy: function() {
          this._container
            .off("click.MonitorDebugTreeItemWidget")
            .off("dblclick.MonitorDebugTreeItemWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          this.emit(gbc.constants.widgetEvents.click);
          event.stopPropagation();
        },
        _onDoubleClick: function(event) {
          this._toggleCollapsed();
          event.stopPropagation();
        },
        setLabel: function(label) {
          this._label.textContent = label;
        },
        setIdRef: function(idRef) {
          this._idRefNumber = idRef;
          this._idRef.textContent = idRef;
        },
        getIdRef: function() {
          return this._idRefNumber;
        },
        setIconColor: function(color) {
          this.setStyle('>.description>.icon', {
            "background-color": color
          });
        },
        setCollapsed: function(collapsed) {
          this._toggleCollapsed(!!collapsed);
        },
        _toggleCollapsed: function(collapsed) {
          if (collapsed === true) {
            if (!this._collapsed) {
              this._collapsed = true;
              this._containerElement.remove();
            }
          } else if (collapsed === false) {
            if (this._collapsed) {
              this._collapsed = false;
              this._element.appendChild(this._containerElement);
            }
          } else {
            this._collapsed = !this._collapsed;
            if (this._collapsed) {
              this._containerElement.remove();
            } else {
              this._element.appendChild(this._containerElement);
            }
          }
          this._element.toggleClass("collapsed", !!this._collapsed);
        },
        setHighlighted: function(highlighted) {
          this._element.toggleClass("highlighted", highlighted);
          if (highlighted) {
            var p = this.getParentWidget();
            while (p instanceof cls.MonitorDebugTreeItemWidget) {
              p.setCollapsed(false);
              p = p.getParentWidget();
            }
          }
        }
      };
    });
    cls.WidgetFactory.register('MonitorDebugTreeItem', cls.MonitorDebugTreeItemWidget);
  });
