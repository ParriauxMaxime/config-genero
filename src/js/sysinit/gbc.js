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

(
  /**
   * @param {Window} context
   */
  function(context) {

    /**
     * @namespace {object} classes
     * @alias classes
     */
    var classes = {};

    /**
     * @class gbc
     */
    var gbc = jsface.Singleton(
      /** @lends gbc */
      {
        __name: "gbc",
        /**
         * @type {jsface}
         */
        oo: window.jsface,
        keyboard: window.mousetrapped,

        version: "%%VERSION%%" || "none",
        build: "%%BUILD%%" || "none",
        tag: "%%TAG%%" || "dev-snapshot",
        dirtyFlag: "%%DIRTY%%" || "",
        prodMode: "%%PROD%%",
        qaMode: false,
        unitTestMode: false,
        canShowExitWarning: true,
        bootstrapInfo: window.__gbcBootstrap || {},
        embedded: window.embeddedInfo,
        moment: window.moment,
        styler: window.styler,
        StateMachine: window.StateMachine,
        classes: classes,
        constants: {},
        errorCount: 0,
        jsErrorCount: 0,
        preStart: function() {
          if (this.bootstrapInfo.serverVersion) {
            this.bootstrapInfo.serverVersion = this.bootstrapInfo.serverVersion.replace(" - Build ", "-");
          }
          this.bootstrapInfo.subAppInfo = parseInt(this.bootstrapInfo.subAppInfo) || 0;
          context.gbc.DebugService.whenActivationChanged(function(event, src, active) {
            if (!active) {
              context.gbc.LogService.registerLogProvider(new classes.NoLogProvider(), "typeahead");
              context.gbc.LogService.registerLogProvider(new classes.NoLogProvider(), "networkProtocol");
              context.gbc.LogService.registerLogProvider(new classes.NoLogProvider(), null);
            } else {
              context.gbc.LogService.registerLogProvider(new classes.ConsoleLogProvider(), "typeahead");
              context.gbc.LogService.registerLogProvider(new classes.ConsoleLogProvider(), "networkProtocol");
              context.gbc.LogService.registerLogProvider(new classes.BufferedConsoleLogProvider(), null);
            }
          });
          context.gbc.LogService.registerLogProvider(new classes.NoLogProvider(), "typeahead");
          context.gbc.LogService.registerLogProvider(new classes.NoLogProvider(), "networkProtocol");
          context.gbc.LogService.registerLogProvider(new classes.NoLogProvider(), null);

          if (window.location.search.toLowerCase().indexOf("debugmode=1") >= 0) {
            context.gbc.DebugService.activate();
          }
          if (window.location.search.toLowerCase().indexOf("debugmode=0") >= 0) {
            context.gbc.DebugService.disable();
          }
          // TODO Use same code convention this === context.gbc ????
          this.bootstrapInfo.gbcPath = "resources";
          context.gbc.HostService.wrapGlobalErrors();

          if (window.location.search.toLowerCase().indexOf("qainfo=1") >= 0) {
            context.gbc.qaMode = true;
          }

          // inhibit default browser behaviors
          document.body.addEventListener('keydown', function(event) {
            if (event.ctrlKey) {
              if (event.which === 80 /* p */ || event.which === 83 /* s */ ) {
                event.preventDefault();
              }
              if (event.which === 65 /* a */ && event.target.tagName !== "TEXTAREA" && event.target.tagName !== "INPUT") {
                event.preventDefault();
              }
            }

            if (event.which === 8 /* backspace */ && ((event.target.tagName !== "TEXTAREA" && event.target.tagName !== "INPUT") ||
                event.target.readOnly)) {
              event.preventDefault(); // inhibit previous page on backspace
            }
          });

          if (context.gbc.qaMode) {
            context.gbc.classes.DebugHelper.activateDebugHelpers();
          }
        },
        start: function() {
          if (this.__gbcStarted) {
            return;
          }
          this.__gbcStarted = true;
          gbc.HostService.preStart();
          document.body.addClass("flexible_host_stretch_row");
          if (gbc.DebugService.isMonitorWindow()) {
            return;
          }
          context.gbc.HostService.start();
        },
        run: function() {
          modulum.assemble();
          gbc.InitService.initServices();
          gbc.preStart();
          var start = function() {
            gbc.start();
          };
          if (Object.isFunction(context.__gbcDefer)) {
            context.__gbcDefer(start);
          } else {
            window.requestAnimationFrame(start);
          }

          if (gbc.embedded.nwjs) {
            gbc.DirectModeService.switchToDirectMode();
          }
        },
        errors: [],
        showExitWarning: function() {
          if (gbc.constants.theme["gbc-desactivate-ending-popup"] !== 'true' &&
            !context.__desactivateEndingPopup &&
            (window.location.search.toLowerCase().indexOf("noquitpopup=1") < 0) &&
            !context.gbc.DebugService.isActive() && gbc.SessionService.getCurrent() && gbc.SessionService
            .getCurrent().getCurrentApplication()) {
            return "The Genero application is still running.\n" +
              "If you leave now, some data may be lost.\n" +
              "Please use the application user interface to exit the application before navigating away from this page.";
          }

        }
      });

    var callback = function(stackframes) {
      console.log("ERROR");
      var stringifiedStack = stackframes.map(function(sf) {
        return sf.toString();
      }).join('\n');
      console.log(stringifiedStack);
    };

    var errback = function(err) {
      console.error(err);
    };
    gbc.error = function(errorText, error) {
      console.log(errorText);
      var err = error || (errorText && errorText.stack && errorText);
      if (window.StackTrace && err) {
        window.StackTrace.fromError(err).then(callback).catch(errback);
      }
    };
    context.onerror = function(msg, file, line, col, error) {
      gbc.error(error);
    };

    gbc.stack = function() {
      if (window.StackTrace) {
        window.StackTrace.generateArtificially().then(callback).catch(errback);
      }
    };

    context.addEventListener("unload", function() {
      gbc.InitService.emit(gbc.constants.widgetEvents.onUnload);
    });
    context.onbeforeunload = function() {
      //emit hook
      gbc.InitService.emit(gbc.constants.widgetEvents.onBeforeUnload);
      if (gbc.canShowExitWarning) {
        // Deprecated since chrome 51 : https://www.chromestatus.com/feature/5349061406228480
        return gbc.showExitWarning();
      }
    };
    modulum.inject(gbc, gbc.classes);
    window.addEventListener('unload', function() {
      gbc.DebugService.destroy();
      gbc.InitService.destroy();
      document.body.innerHTML = "";
    });

    gbc.__isIdleTest = function(callback) {
      window.requestAnimationFrame(function() {
        window.setTimeout(function() {
          try {
            var session = window.gbc && window.gbc.SessionService && window.gbc.SessionService.getCurrent();
            callback({
              session: !!session,
              idle: !session || !session.getCurrentApplication() || session.isCurrentIdle()
            });
          } catch (e) {
            var result = {
              ___TEST_EXCEPTION: true
            };
            result.message = e.toString();
            result.stack = e.stack.toString();
            callback(result);
          }
        }, window.browserInfo && (window.browserInfo.isIE || window.browserInfo.isFirefox) ? 30 : 1);
      });
    };

    if (window.location.search.toLowerCase().indexOf("unittestmode=1") >= 0) {
      gbc.unitTestMode = true;
    }

    window.gbc = gbc;
  })(window);
