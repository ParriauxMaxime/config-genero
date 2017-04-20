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

modulum("CharSize",
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * charsize (widthM, width0, height)
     * @class classes.CharSize
     */
    cls.CharSize = context.oo.Class(function() {
      /** @lends classes.CharSize.prototype */
      return {
        /** @lends classes.CharSize */
        $static: {
          translate: function(size, widthM, width0) {
            return cls.Size.translate(size, function(s) {
              var result = Math.min(6, s) * widthM;
              if (s > 6) {
                result += (s - 6) * width0;
              }
              return result;
            });
          },
        },
        __name: "CharSize",
        /**
         * @type {number|object}
         */
        _widthM: null,
        /**
         * @type {number|object}
         */
        _width0: null,
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
        _defaultWidthM: 0,
        /**
         * @type {Number}
         */
        _defaultWidth0: 0,
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
          this._widthM = Object.isNumber(opts.widthM) ? opts.widthM : cls.Size.undef;
          this._width0 = Object.isNumber(opts.width0) ? opts.width0 : cls.Size.undef;
          this._height = Object.isNumber(opts.height) ? opts.height : cls.Size.undef;
        },

        reset: function() {
          this._widthM = cls.Size.undef;
          this._width0 = cls.Size.undef;
          this._height = cls.Size.undef;
        },

        hasWidthM: function(considerZero) {
          return this._widthM !== cls.Size.undef && (!!considerZero || this._widthM > 0);
        },
        hasWidth0: function(considerZero) {
          return this._width0 !== cls.Size.undef && (!!considerZero || this._width0 > 0);
        },
        hasHeight: function(considerZero) {
          return this._height !== cls.Size.undef && (!!considerZero || this._height > 0);
        },
        hasSize: function(considerZero) {
          return (this.hasWidth0(considerZero) && this.hasWidthM(considerZero)) || this.hasHeight(considerZero);
        },
        getWidthM: function(useFallback) {
          if (!!useFallback && !this.hasWidthM(true)) {
            return this._defaultWidthM;
          }
          return this._widthM;
        },
        getWidth0: function(useFallback) {
          if (!!useFallback && !this.hasWidth0(true)) {
            return this._defaultWidth0;
          }
          return this._width0;
        },
        getHeight: function(useFallback) {
          if (!!useFallback && !this.hasHeight(true)) {
            return this._defaultHeight;
          }
          return this._height;
        },
        setWidthM: function(widthM) {
          if (widthM === null) {
            this._widthM = cls.Size.undef;
          } else {
            this._widthM = widthM;
          }
        },
        setWidth0: function(width0) {
          if (width0 === null) {
            this._width0 = cls.Size.undef;
          } else {
            this._width0 = width0;
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
