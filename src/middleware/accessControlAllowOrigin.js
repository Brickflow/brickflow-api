'use strict';
var _ = require('lodash');
var config = require('../config');

module.exports = function *(next) {
  if (this.request.header.origin) {
    var domain = this.request.header.origin.split('://').pop().split(':')[0];
    if (_.contains(config.get('ALLOW_ORIGINS'), domain)) {
      this.set('Access-Control-Allow-Origin', this.request.header.origin);
      this.set('Access-Control-Allow-Headers',
          this.request.header['access-control-request-headers'] ||
          'accept, content-type');
    }
  }
  yield next;
};