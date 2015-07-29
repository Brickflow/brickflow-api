var koa = require('koa');
var router = require('koa-router'); // must expose app.getRouter() for newrelic

var app = koa();

app.name = 'Brickflow API v1';

require('brickflow-common');

require('./fflip').koa(app);

app.use(require('../middleware/accessControlAllowOrigin'));

app.use(router(app));
app.use(require('koa-router-newrelic')(app.router));

app.use(require('../middleware/xResponseTime'));
app.use(require('../middleware/logApiRequest'));

module.exports = app;