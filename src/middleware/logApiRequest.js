'use strict';
var logger = require('../metrics').createTracker('apiRequest');
module.exports = function *(next) {
  var startAt = new Date;
  yield next;
  logger.info('apiRequest', {
    url: this.request.url,
    duration: new Date - startAt
  })
};