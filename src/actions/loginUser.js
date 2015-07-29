'use strict';
var _ = require('lodash');
var tumblr = require('tumblr-pool.js');
var config = require('../config');
var User = require('brickflow-common/model/user');
var generateHash = require('brickflow-common/service/generateHash');
var metrics = require('../metrics');
var errLogger = metrics.createTracker('apiError');

function loginUser(params, cb) {
  var token = params.tumblrAccessToken;
  var tokenSecret = params.tumblrSecret;

  var t = tumblr.createClient({
    consumer_key: config.get('private:TUMBLR_APP_KEY'),
    consumer_secret: config.get('private:TUMBLR_APP_SECRET'), 
    token: token,
    token_secret: tokenSecret
  });

  t.userInfo(function (err, res) {
    var username = res.user.name;
    User.findOrCreate(
      {
        tumblrUsername: username 
      },
      {
        tumblrUsername: username,
        tumblrAccessToken: token,
        tumblrSecret: tokenSecret,
        hash: generateHash()
      },
      function (err, user, created) {
        if (created) {
          //userCtr.afterRegistration(user);
        } else if (user.tumblrAccessToken !== token ||
                    user.tumblrSecret !== tokenSecret) {
          user.tumblrAccessToken = token;
          user.tumblrSecret = tokenSecret;
          User.update({
            tumblrUsername: username
          }, {
            tumblrAccessToken: token,
            tumblrSecret: tokenSecret
          }, _.noop);
          }
        if (err) {
          return cb(err, {'status': 'err'});
        }
        return cb(null, {
          'status': 'ok',
          'user': user
        }); 
      }
    );
  });

}

module.exports = function *(next) {
  try {
    this.body = yield _.partial(loginUser,
        _.pick(this.request.body.fields, 'tumblrAccessToken', 'tumblrSecret'));
  } catch (err) {
    errLogger.error('apiError', {
      action: 'loginUser',
      err: err,
      stack: err.stack ? err.stack : null,
      happenedAt: new Date()
    });

  } finally {
    yield next;
  }
};
