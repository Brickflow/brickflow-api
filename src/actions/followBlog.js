'use strict';
var _ = require('lodash');
var UserCtr = require('brickflow-common/controller/userCtr');
var InteractionCtr = require('brickflow-common/controller/interactionCtr');
var tumblr = require('brickflow-common/service/tumblr');
var Follow = require('brickflow-common/model/follow');
var metrics = require('../metrics');
var tracker = metrics.createTracker('follow');
var errLogger = metrics.createTracker('apiError');


function followBlog(user, blogName, cb) {
  UserCtr.incrementDailyFollows(user);
  var followEntity = new Follow({
    followerUser: user.id,
    followedBlog: blogName
  });
  followEntity.save(function(){
    Follow.count({}, function(err, c) {
      tracker.info('follow-count', {count: c});
    });
  });
  tumblr.followBlog(user, blogName, function(err) {
    cb(err, {status: err ? 'error' : 'success'});
  });
}

module.exports = function *(next) {
  try {
    this.body = yield _.partial(followBlog, this.user, this.params.blogName);
    InteractionCtr.forUser(this.user).followed(this.params.blogName);
  } catch(e) {
    this.body = {status: 'error'};
    errLogger.error('followBlog', {
      action: 'followBlog',
      err: err,
      stack: err.stack ? err.stack : null,
      happenedAt: new Date
    });

  } finally {
    yield next;
  }
};
