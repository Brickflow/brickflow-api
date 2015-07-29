'use strict';
var _ = require('lodash');
var getById = require('brickflow-common/controller/brickCtr').getById;
var metrics = require('../metrics');
var errLogger = metrics.createTracker('apiError');

// TODO MAKE THIS ASYNC
module.exports = function *(next) {
  try {
    if (this.query && this.query.id) {
      this.body.bricks.unshift(yield _.partial(getById, this.query.id));
    }
  } catch (e) {
    errLogger.error('apiError', {
      action: 'withBrickById',
      err: err,
      stack: err.stack ? err.stack : null,
      happenedAt: new Date
    });
  } finally {
    yield next;
  }
};