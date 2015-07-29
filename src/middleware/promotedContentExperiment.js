'use strict';
var config = require('../config');

module.exports = function* promotedContentExperiment(next) {
  try {
    var promotedFeature = null;
    //for (var i = 0; i < 12 && promotedFeature === null; i++) {
    //  if (this.fflip && this.fflip.features['promotedContent' + i]) {
    //    promotedFeature = 'promotedContent' + i;
    //  }
   // }

  if (/trending/.test(this.request.path)) {
    var positions = [];
    while (positions.length < 12) {
      var random = Math.round(Math.random() * 25);
      if (positions.indexOf(random) === -1) {
        positions.push(random);
      }
    }
    positions.forEach(function(e, i) {
      var promotedBrick =
        config.get('PROMOTED_CONTENT_EXPERIMENT')['promotedContent' + i];
      this.body.bricks.splice(e, 0, promotedBrick);
    }.bind(this));
  }
  } catch (err) {
    console.log('ERROR!!!11 promotedContentExperiment FAILED', err);
  } finally {
    yield next;
  }
};
