'use strict';
var _ = require('lodash');
var User = require('brickflow-common/model/user');
var metrics = require('../metrics');
var errLogger = metrics.createTracker('apiError');

function findUser(user, cb) {
  User.findOne({_id: user._id}, function(err, user) {
    if (err) {
      return cb(err, {status: 'error'});
    }
    return cb(null, {status: 'ok', user: user});
  });
}

module.exports = function *(next) {
  try {
    this.body = yield _.partial(findUser, this.user); 
  } catch (err) {
    errLogger.error('apiError', {
      action: 'user',
      err: err,
      stack: err.stack ? err.stack : null,
      happenedAt: new Date()
    });

  } finally {
    yield next;
  }
};
