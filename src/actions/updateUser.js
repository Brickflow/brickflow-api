'use strict';
var _ = require('lodash');
var User = require('brickflow-common/model/user');
var metrics = require('../metrics');
var errLogger = metrics.createTracker('apiError');

function updateUser(user, params, cb) {
  User.findOneAndUpdate({_id: user._id}, params, function(err) {
    cb(err, {status: err ? 'error' : 'ok'});
  });
}

module.exports = function *(next) {
  try {
    this.body = yield _.partial(updateUser, this.user,
        _.pick(this.request.body.fields,
            ['email', 'showedModals', 'dailyShares', 'dailyFollows']));
  } catch (err) {
    errLogger.error('apiError', {
      action: 'updateUser',
      err: err,
      stack: err.stack ? err.stack : null,
      happenedAt: new Date()
    });

  } finally {
    yield next;
  }
};
