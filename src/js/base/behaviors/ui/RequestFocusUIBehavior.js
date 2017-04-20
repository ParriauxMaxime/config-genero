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

modulum('RequestFocusUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RequestFocusUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.RequestFocusUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.RequestFocusUIBehavior.prototype */
      return {
        __name: "RequestFocusUIBehavior",

        /**
         *
         * @protected
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (!!widget) {
            data.focusListener = widget.when(context.constants.widgetEvents.requestFocus, this._onRequestFocus.bind(this,
              controller,
              data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.focusListener) {
            data.focusListener();
            data.focusListener = null;
          }
        },

        _onRequestFocus: function(controller, data) {
          // Keep capture allowed value when the event is received.
          var restoringFocus = context.FocusService.isRestoringFocus();
          if (!restoringFocus) {
            switch (controller.getNodeBindings().container.getTag()) {
              case 'Matrix':
                this.requestMatrixFocus(controller, data);
                break;
              case 'TableColumn':
                this.requestTableFocus(controller, data);
                break;
              default:
                this.requestFieldFocus(controller, data);
            }
          }
        },

        /**
         * Requests the focus on a classic field
         * @returns {boolean} true if the focus has been requested, false if it wasn't necessary
         */
        requestFieldFocus: function(controller, data) {
          var containerNode = controller.getNodeBindings().container;
          if (containerNode.attribute('active') === 0) {
            // Do not request any focus if not active to not cancel selection of text during this operation (needed to CTRL-C)
            // https://agile.strasbourg.4js.com/jira/browse/GBC-669
            return false;
          }
          var app = containerNode.getApplication();
          var ui = app.getNode(0);

          if (ui.attribute('focus') !== containerNode.getId()) {
            var cursors = {
              start: 0,
              end: 0
            };

            //special for webcomp
            var originWidgetNode = app.getNode(ui.attribute('focus'));
            var originWidgetController = originWidgetNode.getController();
            var originWidget = originWidgetNode.getController().getWidget();
            if (originWidget && originWidget.flushWebcomponentData) {
              originWidget.flushWebcomponentData();
            }

            originWidgetController.sendWidgetValue(); //only if value changed

            var widget = controller.getWidget();
            if (widget && widget.getCursors) {
              cursors = widget.getCursors();
            }

            var event = new cls.VMConfigureEvent(containerNode.getId(), {
              cursor: cursors.start,
              cursor2: cursors.end
            });
            event.directFire = true;
            app.event(event);
            return true;
          }
          return false;
        },

        /**
         * Requests the focus on a Matrix
         * @returns {boolean} true if the focus has been requested, false if it wasn't necessary
         */
        requestMatrixFocus: function(controller, data) {
          var containerNode = controller.getNodeBindings().container;
          if (containerNode.attribute('active') === 0) {
            // Restore the focus to its previous location
            return true;
          }
          var app = containerNode.getApplication();
          var ui = app.getNode(0);

          var valueNodeIndex = controller.getAnchorNode().getIndex();
          var offset = containerNode.attribute('offset');
          var vmCurrentRow = containerNode.attribute('currentRow');
          var currentRow = valueNodeIndex + offset;

          var isSameCurrentRow = currentRow === vmCurrentRow;

          var cursors = {
            start: 0,
            end: 0
          };
          var widget = controller.getWidget();
          if (widget && widget.getCursors) {
            cursors = widget.getCursors();
          }

          if (ui.attribute('focus') !== containerNode.getId() || !isSameCurrentRow) {

            var originWidgetNode = app.getNode(ui.attribute('focus'));
            var originWidgetController = originWidgetNode.getController();
            originWidgetController.sendWidgetValue(); //only if value changed

            var event = new cls.VMConfigureEvent(containerNode.getId(), {
              currentRow: currentRow,
              cursor: cursors.start,
              cursor2: cursors.end
            });
            event.directFire = true;
            app.event(event);
            return true;
          }
          return false;
        },

        /**
         * Requests the focus on a Table
         * @returns {boolean} true if the focus has been requested, false if it wasn't necessary
         */
        requestTableFocus: function(controller, data) {
          var containerNode = controller.getNodeBindings().container;
          if (containerNode.attribute('active') === 0 && containerNode.attribute('noEntry') === 0) {
            // Restore the focus to its previous location
            return true;
          }
          var tableNode = containerNode.getParentNode();
          var app = tableNode.getApplication();
          var ui = app.getNode(0);

          var eventParams = {};
          var valueNodeIndex = controller.getAnchorNode().getIndex();
          var offset = tableNode.attribute('offset');
          eventParams.currentRow = valueNodeIndex + offset;

          var needFocus = ui.attribute('focus') !== tableNode.getId() ||
            eventParams.currentRow !== tableNode.attribute('currentRow');

          var dialogType = containerNode.attribute('dialogType');
          var displayDialog = dialogType === "Display" || dialogType === "DisplayArray";

          var focusOnField = tableNode.attribute('focusOnField') === 1;
          if (!displayDialog || focusOnField) { // Input, InputArray, Construct or FocusOnField attribute set
            eventParams.currentColumn = containerNode.getIndex('TableColumn');
            needFocus = needFocus || eventParams.currentColumn !== tableNode.attribute('currentColumn');
          }

          if (needFocus) {
            var event = new cls.VMConfigureEvent(tableNode.getId(), eventParams);
            var events = [event];
            if (!displayDialog) {

              var widget = tableNode.getController().getWidget().getItemWidget(eventParams.currentColumn, valueNodeIndex);
              var originWidgetNode = app.getNode(ui.attribute('focus'));
              var originWidgetController = originWidgetNode.getController();
              originWidgetController.sendWidgetValue(); //only if value changed

              if (widget.getCursors) {
                var cursors = widget.getCursors();
                var event2 = new cls.VMConfigureEvent(containerNode.getId(), {
                  cursor: cursors.start,
                  cursor2: cursors.end
                });

                events = events.concat(event2);
              }
            }

            if (tableNode.attribute('multiRowSelection') === 0) {
              events[events.length - 1].directfire = true;
            } // in case of multirowselection there can be a rowselection event after thus we don't direct fire
            app.event(events);

            return true;
          }
          return false;
        }

      };
    });
  });
