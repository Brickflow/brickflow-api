'use strict';
var BrickCtr = require('brickflow-common/controller/brickCtr');
var InteractionCtr = require('brickflow-common/controller/interactionCtr');
var errLogger = require('../metrics').createTracker('apiError');

module.exports = function *(next) {
  try {
    var userHas = InteractionCtr.forUser(this.user);
    userHas.dismissedBlog(this.params.blogName);
    this.body = { status: 'success' };
  } catch (err) {
    errLogger.error('apiError', {
      action: 'dismissBlog2',
      err: err,
      stack: err && err.stack ? err.stack : null
    });
    this.body = { status: 'error' };
  } finally {
    yield next;
  }
};
