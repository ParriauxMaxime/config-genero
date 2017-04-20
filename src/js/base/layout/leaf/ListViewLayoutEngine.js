/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ListViewLayoutEngine', ['LeafLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ListViewLayoutEngine
     * @extends classes.LeafLayoutEngine
     */
    cls.ListViewLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      /** @lends classes.ListViewLayoutEngine.prototype */
      return {
        __name: "ListViewLayoutEngine",

        prepareMeasure: function() {
          $super.prepareMeasure.call(this);
        },

        measure: function() {
          $super.measure.call(this);
        },

        ajust: function() {

        },

        invalidateMeasure: function(invalidation, from) {
          if (!from) {
            $super.invalidateMeasure.call(this, invalidation);
          }
        },

        invalidateAllocatedSpace: function(invalidation) {
          this._invalidatedAllocatedSpace = invalidation || cls.LayoutEngineBase.nextInvalidation();
        },

        getRenderableChildren: function() {
          return [];
        }
      };
    });
  });
