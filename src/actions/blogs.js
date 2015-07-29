'use strict';
var errLogger = require('../metrics').createTracker('apiError');
var blogCacheWithFallback =
    require('brickflow-common/feed/blogCacheWithFallback');
module.exports = function *(next) {
  try {
    var blogs = yield blogCacheWithFallback;
    this.body = {
      blogs: blogs,
      status: {
        blogs: blogs.length
      }
    };
  } catch (err) {
    errLogger.error('blog-error', {
      action: 'blogs',
      err: err,
      stack: err.stack ? err.stack : null,
      happenedAt: new Date
    });
  } finally {
    yield next;
  }
};
