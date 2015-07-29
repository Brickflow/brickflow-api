'use strict';
var _ = require('lodash');
var config = require('../config');
var metrics = require('../metrics');
var errLogger = metrics.createTracker('apiError');
var MAX = config.get('TRIM_FEED_LENGTH');

function isTooLong(item) {
  return (item && item.length > MAX) ? _.first(item, MAX) : item; }

var trimArray = _.partialRight(_.first, MAX);
function trim(wrapper, key) {
  wrapper[key] = trimArray(wrapper[key]); }

module.exports = function *(next) {
  try {
    if (this.body) {

      if (isTooLong(this.body.bricks)) {
        trim(this.body, 'bricks');
      } else if (isTooLong(this.body.blogs)) {
        trim(this.body, 'blogs');
      }
    }
  } catch(err) {
    errLogger.error('apiError', {
      trimFeed: true,
      err: err,
      stack: err.stack
    })
  } finally {
    yield next;
  }
};
