'use strict';
var _ = require('lodash');
var trendingCache = require('brickflow-common/feed/trendingCache');
var config = require('../config');
module.exports = function *(next) {
  if (this.user) {
    this.body = yield _.partial(trendingCache.unseen.getOnce, this.user);
  } else {
    this.body = yield trendingCache.getOnce
  }
  yield next;
  /*
  try {
    if (this.fflip && this.fflip.features.ryanContentExperiment) {
      _(config.get('RYAN_CONTENT_EXPERIMENT_BRICKS')).each(function(brick, cnt) {
        this.body.bricks.splice(2 * cnt + 1, 0, brick);
      }, this);
    }
  } catch (e) {
    console.log('CONTENTEXPERIMENTPROBLEM', e.stack);
  } finally {
    yield next;
  }
  */
};
