'use strict';
var _ = require('lodash');
var User = require('brickflow-common/model/user');

module.exports = function *(next) {
  this.user = yield User.findOne({
    tumblrAccessToken: this.query.accessToken
  }).exec();
  if (this.user) {
    this.fflip.setForUser(this.user);
  } else {
    this.status = 401;
    throw new Error('Y U no auth!?');
  }
  yield next;
};
