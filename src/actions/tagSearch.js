'use strict';
var _ = require('lodash');
var tagSearch = require('brickflow-common/feed/tagSearch');

var metrics = require('../metrics');
var logger = metrics.createTracker('tagSearch');
var errLogger = metrics.createTracker('apiError');
var InteractionCtr = require('brickflow-common/controller/interactionCtr');

module.exports = function *(next) {
  try {
    this.body = yield _.partial(tagSearch, this.params.tag, { giphy: true });
    var totalLength = this.body.bricks.length;
    this.body.bricks = yield
        _.partial(InteractionCtr.forUser(this.user).
            exclude.seen, 'bricks', this.body.bricks);
    logger.info('tagSearch', {
      tag: this.params.tag,
      beforeFilter: totalLength,
      afterFilter: this.body.bricks.length,
      filtered: totalLength - this.body.bricks.length,
      happenedAt: new Date
    });
  } catch (err) {
    errLogger.error('tagSearch', {
      action: 'tagSearch',
      err: err,
      stack: err.stack ? err.stack : null,
      happenedAt: new Date
    });
  } finally {
    yield next;
  }
};