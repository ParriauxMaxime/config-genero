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
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * populates the headers from the response object
     * @memberOf UAInterface
     * @private
     * @param jqXHR the $.ajax jqXHR response
     * @returns a map of gbc aware headers
     */
    var getHeaders = function(jqXHR) {
      var result = {};
      var keys = Object.keys(context.constants.network.headers);
      for (var k = 0; k < keys.length; k++) {
        var headerName = context.constants.network.headers[keys[k]];
        result[keys[k]] = jqXHR.getResponseHeader(headerName);
      }
      return result;
    };
    var runNewTask = function(session, taskId, callback) {
      window.setTimeout(function(session, taskId, callback) {
        var sessionInstance = (session instanceof cls.VMSession) ? session :
          context.SessionService.getSession(session);
        if (sessionInstance) {
          sessionInstance.startTask(taskId, callback);
        }
      }.bind(null, session, taskId, callback), 10);
    };

    /**
     * manages special headers from sever whenever a response is received
     * @memberOf UAInterface
     * @private
     * @param args the arguments of the $.ajax callback (data, status, jqXHR)
     * @param uaProtocol the uaProtocol instance
     * @param {classes.VMApplication} application
     * @param onSuccess the callback in case of success
     */
    var canRun = function(args, uaProtocol, application, onSuccess) {
      if (!application) {
        if (uaProtocol.transition) {
          uaProtocol.transition.cancel();
        }
      } else {
        if (application.info().ending) {
          application.setError();
          if (uaProtocol.transition) {
            uaProtocol.transition.cancel();
          }
          uaProtocol.headerError();
        } else {
          var headers = getHeaders(args[2]);
          if (headers.devmode === "true") {
            context.DebugService.activate();
          }
          if (headers.webComponent) {
            context.WebComponentProxyService.setWebcomponentUrl(headers.webComponent);
          }
          if (headers.error) {
            application.setError();
            if (uaProtocol.transition) {
              uaProtocol.transition.cancel();
            }
            uaProtocol.headerError(headers.error);
          } else if (headers.closed) {
            if (uaProtocol.transition) {
              uaProtocol.transition.cancel();
            }
            application.setEnding();
            uaProtocol.endApp(headers.closed);
          } else if (headers.newTask) {
            runNewTask(application.getSession(), headers.newTask, function() {
              onSuccess(args[0], headers);
            });
          } else if (headers.contentType === "text/html") {
            window.__desactivateEndingPopup = true;
            window.location.reload();
          } else {
            onSuccess(args[0], headers);
          }
        }
      }
    };
    /**
     * UAProxy protocol interface. manages the full protocol as a state machine
     * @class classes.UAInterface
     * @extends classes.ProtocolInterface
     */
    cls.UAInterface = context.oo.Class({
      base: cls.ProtocolInterface
    }, function() {
      /** @lends classes.UAInterface.prototype */
      return {
        __name: "UAInterface",
        sessionId: null,
        /** @type classes.VMApplication */
        application: null,
        uaProtocol: null,
        ping: null,
        eventQueue: null,
        eventInterval: null,
        eventIntervalTimeout: 30,
        onFirstGuiReady: null,
        applicationEnding: null,
        taskCount: 0,

        /**
         *
         * @param {classes.VMApplication} application
         */
        constructor: function(application) {
          this.application = application;
          this.sessionId = application.getSession()._identifier;
          this.onFirstGuiReady = [];
          this.eventQueue = [];
          var uaInterface = this;
          /**
           * The ua protocol is managed by Finite State Machine
           * @memberOf UAInterface
           * @see https://github.com/jakesgordon/javascript-state-machine
           */
          var uaProtocol = this.uaProtocol = context.StateMachine.create({
            /**
             * the general error handler
             */
            error: function(eventName, from, to, args, errorCode, errorMessage, e) {
              console.error(eventName, from, to, args, errorCode, errorMessage);
              context.error(e);
              application.info().ending = cls.ApplicationEnding.notok("" + errorCode + ". " + errorMessage);
              //            application.error(eventName, errorMessage);
              //          application.stop(true);
            },
            /**
             * the different events of the state machine
             * @see the uaStates constant
             */
            events: context.constants.network.uaStates,
            callbacks: {
              /**
               * whenever we leave a state
               */
              onleavestate: function(action, from, to) {
                context.LogService.networkProtocol.debug(["%cSTATE MACHINE (" + application.applicationHash + ") : ", from,
                    " -> [",
                    action, "] -> ", to
                  ].join(""),
                  "background: #282; color: #DDD");
              },
              /**
               * leave sendStart state
               * * if data is defined, it is either true if the app is closing, or an error message
               * * else we read the returning connection string
               */
              onleaveSendStart: function(event, from, to, data) {
                if (!application.info().ending && !data) {
                  cls[application.info().task ? "UAStartupTask" : "UAStartup"].run(application, function(arg1, arg2, arg3, arg4,
                    arg5, arg6, arg7, arg8, arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UAConnectionString.run(data, headers, application);
                        uaProtocol.transition();
                      });
                  });
                  return context.StateMachine.ASYNC;
                }
              },
              /**
               * leave sendStartTask state (new task)
               * * if data is defined, it is either true if the app is closing, or an error message
               * * else we read the returning connection string
               */
              onleaveSendStartTask: function(event, from, to, data) {
                if (!application.info().ending && !data) {
                  cls.UAStartupTask.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UAConnectionString.run(data, headers, application);
                        uaProtocol.transition();
                      });
                  });
                  return StateMachine.ASYNC;
                }
              },
              /**
               * When the connection string is ok, we handshake the server
               */
              onenterRecvConnectionString: function() {
                uaProtocol.handShake();
              },
              /**
               * As we handshake the server, we ask for the initial aui tree
               */
              onenterSendHandShake: function() {
                if (!application.info().ending) {
                  uaInterface.isRunning = true;
                  application.setProcessing();
                  uaProtocol.getInitialAUI();
                } else {
                  uaProtocol.headerError(";");
                }
              },
              onleaveSendHandShake: function(event, from, to, ending) {
                if (!ending) {
                  if (uaInterface.application.ending) {
                    if (event !== "waitForEnd") {
                      if (uaProtocol.transition) {
                        uaProtocol.transition.cancel();
                      }
                      uaProtocol.waitForEnd();
                    }
                  } else {
                    cls.UAHandShake.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                      canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                        function(data, headers) {
                          cls.UAInitialAUI.run(data, headers, application, function() {
                            application.setRunning(true);
                            uaProtocol.transition();
                          });
                        });
                    });
                    return StateMachine.ASYNC;
                  }
                }
              },
              onenterRecvInitialAUI: function() {
                if (application.isProcessing()) {
                  uaProtocol.waitForMoreInitialAUI();
                } else {
                  window.setTimeout(function() {
                    uaProtocol.guiMode();
                  }, 10);
                }
              },
              onenterSendEmpty: function() {
                uaProtocol.getMoreOrder();
              },
              onleaveSendEmpty: function() {
                if (!uaInterface.application.hasError && !uaInterface.application.ending) {
                  cls.UASendEmpty.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UARecvOrder.run(data, headers, application, function() {
                          uaProtocol.transition();
                        });
                      });
                  });
                  return StateMachine.ASYNC;
                }
              },
              onenterRecvOrder: function() {
                if (application.isProcessing()) {
                  uaProtocol.waitForMoreOrder();
                } else {
                  uaProtocol.guiMode();
                }
              },
              onenterGUI: function() {
                if (uaInterface.application.ending) {
                  if (uaProtocol.transition) {
                    uaProtocol.transition.cancel();
                  }
                  uaProtocol.waitForEnd();
                } else {
                  if (uaInterface.onFirstGuiReady) {
                    var callbacks = uaInterface.onFirstGuiReady;
                    uaInterface.onFirstGuiReady = null;
                    while (callbacks.length) {
                      callbacks.splice(0, 1)[0]();
                    }
                  }
                  uaInterface.ping = window.setTimeout(function() {
                    uaProtocol.ping();
                  }, application.info().pingTimeout);

                  var localManageEvents = function(fireIndex) {
                    if (this.eventQueue && this.eventQueue.length) {
                      if (this.application.isIdle() && this.uaProtocol.can("sendOrder")) {
                        this.application.setProcessing();
                        uaProtocol.sendOrder(fireIndex);
                        window.clearInterval(this.eventInterval);
                        this.eventInterval = null;
                      }
                    }
                  };
                  if (uaInterface.eventQueue && uaInterface.eventQueue.length) {
                    var directFireIndex = uaInterface.eventQueue.findIndex(function(item) {
                      return item.directFire === true || (!!item[0] && item[0].directFire === true);
                    });
                    if (directFireIndex >= 0) {
                      localManageEvents.bind(uaInterface)(directFireIndex);
                    } else {
                      if (uaInterface.eventInterval === null) {
                        uaInterface.eventInterval = window.setInterval(localManageEvents.bind(uaInterface), uaInterface.eventIntervalTimeout);
                      }
                    }
                  }
                }
              },
              onleaveGUI: function() {
                window.clearTimeout(uaInterface.ping);
                window.clearInterval(uaInterface.eventInterval);
                this.eventInterval = null;
              },
              onenterSendOrder: function(event, from, to, count) {
                uaInterface._directFireIndex = Object.isNumber(count) ? count : -1;
                uaProtocol.getOrderAnswer();
              },
              onleaveSendOrder: function(event, from, to) {
                if (to !== "ApplicationEnd" && to !== "HeaderError") {
                  var orders = [];
                  if (uaInterface._directFireIndex >= 0) {
                    orders = uaInterface.eventQueue.splice(0, uaInterface._directFireIndex + 1);
                    uaInterface._directFireIndex = -1;
                  } else {
                    orders = uaInterface.eventQueue;
                    uaInterface.eventQueue = [];
                  }
                  cls.UASendOrders.run(orders.flatten(), application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8,
                    arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UARecvOrder.run(data, headers, application, function() {
                          uaProtocol.transition();
                        });
                      });
                  });
                  return StateMachine.ASYNC;
                }
              },
              /**
               * the ping doesn't take care of the answer (apart from the headers)
               */
              onenterPing: function() {
                cls.UAPing.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                  canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                    function() {
                      // no need to manage ping answer
                    });
                });
                uaProtocol.pingSent();
              },
              /**
               * when the application ends, we wait for a confirmation close
               */
              onenterApplicationEnding: function(event, from, to) {
                uaProtocol.endApp(from === "SendHandShake");
              },
              /**
               * until we  the application ends, we wait for a confirmation close
               */
              onleaveApplicationEnding: function(event, from, to, closed) {
                if (!closed) {
                  cls.UASendEndingEmpty.run(application, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
                    canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, uaInterface.application,
                      function(data, headers) {
                        cls.UARecvOrder.run(data, headers, application, function() {
                          if (application.ending) {
                            uaProtocol.transition();
                          } else {
                            uaProtocol.transition.cancel();
                            window.setTimeout(function() {
                              uaProtocol.waitForEnd();
                            }, 1000);
                          }
                        });
                      });
                  });
                  return StateMachine.ASYNC;
                }
              },
              onenterHeaderError: function(event, from, to, msg) {
                if (msg && msg.indexOf("Auto Logout") === 0) {
                  application.info().ending = cls.ApplicationEnding.autoLogout(msg);
                } else {
                  application.info().ending = application.info().ending || cls.ApplicationEnding.uaProxy(msg);
                }
                uaProtocol.endApp();
              },
              onenterApplicationEnd: function() {
                var applicationInfo = application.info();
                applicationInfo.ending = applicationInfo.ending || cls.ApplicationEnding.ok;
                application.stop();
              }
            }
          });
          uaProtocol.start();
        },
        start: function() {
          this.uaProtocol.getConnectionString();
        },
        event: function(events) {
          if (!!events) {
            if (this.application && !this.application.ending) {
              this.application.keyboard.beginCapture(); // active typeahead
              this.application.pendingRequest = true;
              this.eventQueue.push(events);
              window.clearInterval(this.eventInterval);
              this.eventInterval = null;
              if (!!events.directFire || (events[0] && events[0].directFire)) {
                this._manageEvents();
              }

              if (this.eventInterval === null) {
                this.eventInterval = window.setInterval(this._manageEvents.bind(this), this.eventIntervalTimeout);
              }
            } else {
              window.clearInterval(this.eventInterval);
              this.eventInterval = null;
            }
          }
        },
        _manageEvents: function() {
          if (this.application) {
            this.application.pendingRequest = false;
            if (this.application.isIdle() && this.uaProtocol.can("sendOrder")) {
              if (this.eventQueue.length) {
                this.application.setProcessing();
                this.uaProtocol.sendOrder();
                window.clearInterval(this.eventInterval);
                this.eventInterval = null;
              } else {
                window.clearInterval(this.eventInterval);
                this.eventInterval = null;
              }
            }
          } else {
            window.clearInterval(this.eventInterval);
            this.eventInterval = null;
          }
        },
        newTask: function() {
          var session = this.application;
          if (this.application) {
            session = this.application.getSession();
          } else {
            session = context.SessionService.getCurrent();
          }
          session.waitingForNewTask();
          var uaProtocol = this.uaProtocol;
          cls.UANetwork.newTask(this.application || session, function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            if (!!this.application) {
              canRun([arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9], uaProtocol, this.application, Function.noop);
            } else {
              var headers = getHeaders(arg3);
              if (headers.newTask) {
                runNewTask(this.sessionId, headers.newTask, Function.noop);
              } else {
                session.waitedForNewTask();
              }
            }
          }.bind(this));
        },
        interrupt: function() {
          cls.UANetwork.interrupt(this.application);
        },
        close: function() {
          if (this.application.info().session) {
            cls.UANetwork.close(this.application);
            this.uaProtocol.waitForEnd();
          }
        },
        destroy: function() {
          window.clearTimeout(this.ping);
          window.clearInterval(this.eventInterval);
          this.eventInterval = null;
          this.application = null;
          this.eventQueue = null;
          this.uaProtocol = null;
        },
        onGuiReady: function(callback) {
          if (!this.onFirstGuiReady) {
            callback();
          } else {
            this.onFirstGuiReady.push(callback);
          }
        },
        waitForNewApp: function(onSuccess, onFailure) {
          this.application.getSession()._addWaitingApplication(this.application);
          cls.UANetwork.waitTask(this.application, function(response, none, jqXhr) {
            var headers = getHeaders(jqXhr);
            if (headers.vmReady) {
              this.application.getSession()._removeWaitingApplication(this.application);
              var win = cls.WindowHelper.openWindow(cls.UANetwork.newApp(this.application), true);
              window.setTimeout(function(w) { // thank you IE
                this.application.getSession()._registerChildWindow(w);
                onSuccess();
              }.bind(this, win), 50);
            } else {
              if (this.application.info().ending) {
                onFailure();
              } else if (!headers.closed) {
                window.requestAnimationFrame(this.waitForNewApp.bind(this, onSuccess, onFailure));
              } else {
                onFailure();
              }
            }
          }.bind(this));
        }
      };
    });

  })(gbc, gbc.classes);
