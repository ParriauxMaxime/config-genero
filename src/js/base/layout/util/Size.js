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

modulum("Size",
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * size (width, height)
     * @class classes.Size
     */
    cls.Size = context.oo.Class(function() {
      var ratio = parseFloat(window.gbc.constants.theme["gbc-font-size-ratio"]);
      if (Number.isNaN(ratio)) {
        ratio = 1;
      }
      /** @lends classes.Size.prototype */
      return {
        /** @lends classes.Size */
        $static: {
          valueRE: /([0-9]+)(px|em|ch|ln|col|row)/,
          colsRE: /^([0-9]+)(ch|col)?$/,
          undef: "UNDEF",
          getMaxWidth: function() {
            var result = this.undef;
            for (var i = 0; i < arguments.length; i++) {
              var arg = arguments[i];
              if (arg && arg.getWidth() !== this.undef) {
                result = result === this.undef ? arg.getWidth() : Math.max(arg.getWidth(), result);
              }
            }
            return result;
          },
          getMaxHeight: function() {
            var result = this.undef;
            for (var i = 0; i < arguments.length; i++) {
              var arg = arguments[i];
              if (arg && arg.getHeight() !== this.undef) {
                result = result === this.undef ? arg.getHeight() : Math.max(arg.getHeight(), result);
              }
            }
            return result;
          },
          isCols: function(size) {
            return cls.Size.colsRE.test(size);
          },
          defaultTranslate: function(size) {
            return size * 16 * ratio;
          },
          translate: function(size, baseSize) {
            var trans = cls.Size.defaultTranslate;
            if (!!baseSize) {
              if (baseSize instanceof Function) {
                trans = baseSize;
              } else if (!Number.isNaN(+baseSize) && (+baseSize > 0)) {
                trans = function(size) {
                  return size * (+baseSize);
                };
              }
            }
            var pxResult = 0;
            if (!!size) {
              if (Object.isNumber(size)) {
                pxResult = trans(size);
              } else {
                var result = cls.Size.valueRE.exec(size);
                if (result) {
                  var numeric = +result[1],
                    unit = result[2];
                  switch (unit) {
                    case "ln":
                      pxResult = trans(numeric * 2);
                      break;
                    case "col":
                      // TODO : read col widths
                      pxResult = trans(numeric * 2);
                      break;
                    case "row":
                      pxResult = numeric * cls.TableWidget.defaultRowHeight;
                      break;
                    case "ch":
                    case "em":
                      pxResult = trans(numeric);
                      break;
                    default:
                      pxResult = numeric;
                      break;
                  }
                }
              }
            }
            return pxResult;
          },
          __cachedPxImportant: {},
          cachedPxImportant: function(val) {
            if (!this.__cachedPxImportant[val]) {
              this.__cachedPxImportant[val] = [val, "px !important"].join("");
            }
            return this.__cachedPxImportant[val];
          },
          __cachedChImportant: {},
          cachedChImportant: function(val) {
            if (!this.__cachedChImportant[val]) {
              this.__cachedChImportant[val] = [val, "ch !important"].join("");
            }
            return this.__cachedChImportant[val];
          }
        },
        __name: "Size",
        /**
         * @type {number|object}
         */
        _width: null,
        /**
         * @type {number|object}
         */
        _height: null,
        /**
         * @type {boolean}
         */
        _loose: false,
        /**
         * @type {Number}
         */
        _defaultWidth: 0,
        /**
         * @type {Number}
         */
        _defaultHeight: 0,
        /**
         *
         * @param {*} [rawOptions]
         */
        constructor: function(rawOptions) {
          var opts = rawOptions || {};
          this._width = Object.isNumber(opts.width) ? opts.width : cls.Size.undef;
          this._height = Object.isNumber(opts.height) ? opts.height : cls.Size.undef;
        },

        reset: function() {
          this._width = cls.Size.undef;
          this._height = cls.Size.undef;
        },

        hasWidth: function(considerZero) {
          return this._width !== cls.Size.undef && (!!considerZero || this._width > 0);
        },
        hasHeight: function(considerZero) {
          return this._height !== cls.Size.undef && (!!considerZero || this._height > 0);
        },
        hasSize: function(considerZero) {
          return this.hasWidth(considerZero) || this.hasHeight(considerZero);
        },
        getWidth: function(useFallback) {
          if (!!useFallback && !this.hasWidth(true)) {
            return this._defaultWidth;
          }
          return this._width;
        },
        getHeight: function(useFallback) {
          if (!!useFallback && !this.hasHeight(true)) {
            return this._defaultHeight;
          }
          return this._height;
        },
        setWidth: function(width) {
          if (width === null) {
            this._width = cls.Size.undef;
          } else {
            this._width = width;
          }
        },
        setHeight: function(height) {
          if (height === null) {
            this._height = cls.Size.undef;
          } else {
            this._height = height;
          }
        },
        setLoose: function(loose) {
          this._loose = !!loose;
        },
        isLoose: function() {
          return this._loose;
        },
        /**
         *
         * @param {classes.Size} size
         * @returns {classes.Size}
         */
        minus: function(size) {
          return new cls.Size({
            width: this.getWidth(true) - size.getWidth(true),
            height: this.getHeight(true) - size.getHeight(true)
          });
        },
        /**
         *
         * @returns {classes.Size}
         */
        clone: function() {
          var result = new cls.Size({
            width: this.getWidth(true),
            height: this.getHeight(true)
          });
          result._defaultWidth = this._defaultWidth;
          result._defaultHeight = this._defaultHeight;
          return result;
        }
      };
    });
  });
