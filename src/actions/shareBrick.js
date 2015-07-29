'use strict';
var _ = require('lodash');
var BrickCtr = require('brickflow-common/controller/brickCtr');
var UserCtr = require('brickflow-common/controller/userCtr');
var InteractionCtr = require('brickflow-common/controller/interactionCtr');
var tumblr = require('brickflow-common/service/tumblr');
var metrics = require('brickflow-common/metrics');
var errLogger = metrics.createTracker('apiError');
var tracker = metrics.createTracker('share');
var Post = require('brickflow-common/model/post');

function shareBrick(user, options, cb) {
  var brickId = options.brickID, tag = options.tag, type = options.type;
  console.time('shareBrick::BrickCtr.getById');
  BrickCtr.getById(brickId, function (err, brick) {
    console.timeEnd('shareBrick::BrickCtr.getById');
    if (err) {
      return cb('BrickCtr.getById-err', {
        status: 'error',
        shareStatus: 'error',
        msg: 'BrickCtr.getById failed.'
      });
    }

    if (!brick.hashtag) {
      brick.hashtag = tag;
      BrickCtr.setHashtagForId(brickId, tag);
    }

    UserCtr.incrementDailyShares(user);
    console.time('shareBrick::tumblr.shareAndReward');

    cb(null, {
      status: 'success',
      shareStatus: 'success'
    });

    tumblr.shareAndReward({
      brick: brick,
      user: user,
      state: type
    }, function (err, result) {
      console.timeEnd('shareBrick::tumblr.shareAndReward');
      if (!err && (result ? result.status !== 'error' : true)) {
        Post.count({}, function(err, c) {
          tracker.info('share-count', {count: c});
        });
//        cb(null, {
//          status: 'success',
//          shareStatus: 'success'
//        });
//      } else {
//        cb(null, {
//          status: 'error',
//          shareStatus: 'error'
//        });
      }
    });

  });
}

module.exports = function *(next) {
  try {
    if (!_.contains(['published', 'queue'], this.request.body.fields.type)) {
      if (this.request.body.fields.type === 'post') {
        this.request.body.fields.type = 'published';
      } else {
        throw new Error('No share type were given');
      }
    }
    this.body = yield _.partial(shareBrick, this.user,
        _(this.request.body.fields).pick('tag', 'type').assign({
          brickID: this.params.brickId
        }).value());
  } catch(err) {
    errLogger.error('apiError', {
      action: 'shareBrick',
      err: err,
      stack: err.stack ? err.stack : null
    });
    this.body = {status: 'error', stack: err.stack, message: err.message};
  } finally {
    yield next;
  }
  console.time('InteractionCtr.forUser.shared');
  InteractionCtr.forUser(this.user).shared(this.params.brickId);
  console.timeEnd('InteractionCtr.forUser.shared')
};