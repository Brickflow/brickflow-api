'use strict';
require('./config');
require('newrelic');
var app = require('./init/app');

// TODO MAKE THIS ASYNC
var withBrickById = require('./middleware/withBrickById');
var withUser = require('./middleware/withUser');
var withUserHash = require('./middleware/withUserHash');
var withBody = require('koa-better-body')();
var trimFeed = require('./middleware/trimFeed');


app.get('/feed/trending/front', require('./actions/trending'), trimFeed);
app.get('/feed/trending', withUser, require('./actions/trending'),
    withBrickById, trimFeed);
app.get('/feed/search/:tag', withUser,
    require('./actions/tagSearch'), withBrickById, trimFeed);
app.get('/feed/your', withUser,
    require('./actions/recommended'), withBrickById, trimFeed);
app.get('/feed/blog', withUser, require('./actions/blogs'), trimFeed);

app.post('/blog/:tumblrUsername/share/:brickId',
    withUser, withBody, require('./actions/shareBrick'));

app.get('/user', withUserHash, withBody, require('./actions/user'));
app.post('/user/viewBrick/:brickId', withUser, require('./actions/viewBrick'));
app.post('/user/dismissBrick/:brickId', withUser,
    require('./actions/dismissBrick'));
app.post('/user/dismissBlog/:blogName', withUser,
    require('./actions/dismissBlog'));
app.post('/user/follow/:blogName', withUser, require('./actions/followBlog'));
app.post('/user/invite/:email', withUser, require('./actions/invite'));
app.post('/user/update', withUser, withBody, require('./actions/updateUser'));
app.post('/user/login', withBody, require('./actions/loginUser'));
app.get('/user/:tumblrUsername/unsubscribe', require('./actions/unsubscribe'));

app.post('/log/:trackerName/:logLevel', withBody, require('./actions/log'));

app.on('error', require('./actions/onError'));

app.get('/ping', function *(next) {
  this.body = { pingedAt: new Date, success: true };
  yield next;
});

app.listen(8888);
