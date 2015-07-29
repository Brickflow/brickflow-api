'use strict';
var BrickCtr = require('brickflow-common/controller/brickCtr');
var InteractionCtr = require('brickflow-common/controller/interactionCtr');
var errLogger = require('../metrics').createTracker('apiError');

module.exports = function *(next) {
  try {
    var userHas = InteractionCtr.forUser(this.user);
    BrickCtr.getById(this.params.brickId, function(err, brick) {
      if (!err) {
        userHas.dismissed(brick);
      } else {
        errLogger.error('apiError', {
          action: 'dismissBrick',
          err: err,
          stack: err.stack ? err.stack : null
        });
      }
    });
    this.body = { status: 'success' };
  } catch (err) {
    errLogger.error('apiError', {
      action: 'dismissBrick',
      err: err,
      stack: err.stack ? err.stack : null
    });
    this.body = { status: 'error' };
  } finally {
    yield next;
  }
};
