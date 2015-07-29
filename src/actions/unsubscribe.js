'use strict';

var _ = require('lodash');
var UserCtr = require('brickflow-common/controller/userCtr');

module.exports = function *(next) {
  try {
    yield _.partial(UserCtr.unsubscribe, this.params.tumblrUsername);
//    this.body = { status: 'success' };
    this.body = 'You have unsubscribed successfully.';
  } catch(err) {
//    this.body = { status: 'error' , err: err, stack: err.stack};
    this.body = 'An error occured during unsubscription.';
  } finally {
    yield next;
  }
};