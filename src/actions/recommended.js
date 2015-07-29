'use strict';
var _ = require('lodash');
var yourCache = require('brickflow-common/feed/yourCache');
var metrics = require('../metrics');
var errLogger = metrics.createTracker('apiError');

module.exports = function *(next) {
  try {
    var userObj = _.pick(this.user,
        'tumblrUsername', 'tumblrAccessToken', 'tumblrSecret');
    this.body = yield _.partial(yourCache.unseen.getSync, userObj, userObj);
//    this.body = yield _.partial(yourCache.getSync, this.user);
  } catch (err) {
    errLogger.error('recommendedError', {
      action: 'recommended',
      err: err,
      stack: err.stack ? err.stack : null,
      happenedAt: new Date
    });
    this.body = {bricks: [], status: 'error'};
  } finally {
    yield next;
  }
};