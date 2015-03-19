import {
  moduleFor,
  test
} from 'ember-qunit';

import ENV from '../../../config/environment';
import HubService from 'ember-hub-me/services/hub';
import ConfigurationModel from 'ember-hub-me/models/configuration';

var config = ConfigurationModel.create({env:ENV});
var hub;

module( 'Unit - service:hub', {
  beforeEach: function(){
    hub = HubService.create({config:config});
  }
});

// test('raises exception if host missing from createRule', function(assert) {
//   assert.expect(1);

//   assert.throws(hub.createRule());
// });