'use strict';
var fflip = require('koa-fflip');

fflip.config({
  criteria: require('./criteria'),
  features: require('./features'),
  reload: 3600
});

module.exports = fflip;