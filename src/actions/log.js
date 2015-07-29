'use strict';

var _ = require('lodash');
var metrics = require('../metrics');

module.exports = function *(next) {
  try {
    metrics.createTracker(this.params.trackerName)[this.params.logLevel](
        this.request.body.fields.message,
        _.omit(this.request.body.fields, 'message'));
    this.body = { status: 'success' };
  } catch (err) {
    this.body = { status: 'fail', err: err.message, stack: err.stack };
  } finally {
    yield next;
  }
};