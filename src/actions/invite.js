'use strict';

var _ = require('lodash');
//var tumblr = require('brickflow-common/service/tumblr');
var rabbitmq = require('brickflow-common/service/rabbitmq/connection');
var metrics = require('../metrics');
var logger = metrics.createTracker('invite');
var errLogger = metrics.createTracker('apiError');
module.exports = function *(next) {
  try {
    var emails = this.params.email.split(/[\s,:;]+/ig);

    _(emails).uniq().compact().each(function(email) {
      if (! email.match(/.+@.+\..+/ig) ) {
        logger.error('invite-invalid-mail');
        return;
      }


      rabbitmq.publish('mailer', {
        emailType: 'invite',
        user: {
          email: email,
          tumblrUsername: email.split('@')[0] // greeting name in mail,
                                              // not an actual tumblr account
        }
      });
    });

    this.body = { status: 'success', emails: emails};
  } catch (err) {
    this.body = { status: 'error', emails: emails};

  } finally {
    yield next;
  }
};