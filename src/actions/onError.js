var errorLogger = require('../metrics').createTracker('apiError');

module.exports = function(err, ctx) {
  var errObj = {
    action: 'onError',
    err: err.message,
    stack: err.stack,
    happenedAt: new Date
  };
  errorLogger.error('apiError', errObj);
  this.body = errObj;
};