import {
  test
} from 'ember-qunit';

import Ember from 'ember';

import AuthorizationRule from 'ember-hub-me/models/authorization-rule';

module( 'Unit - model:authorization-rule');

test('Should be invalid if authorizer does not implement ajaxPrefix method', function(assert) {
  assert.expect(1);

  var model = AuthorizationRule.create({authorizer:{}, options:{host:'http://localhost:3000'}});

  assert.ok(!model.get('isValid'));
});

test('Should be valid if authorizer implements ajaxPrefix method', function(assert) {
  assert.expect(1);

  var authorizer = {
    ajaxPrefilter:function(){}
  };

  var options = {
    host:'http://localhost:3000'
  };

  var model = AuthorizationRule.create({options:options, authorizer:authorizer});

  assert.ok(model.get('isValid'));
});

test('Should match url defined without port when called with port', function(assert) {
  assert.expect(1);

  var authorizer = {
    ajaxPrefilter:function(){}
  };

  var options = {
    host:'http://localhost'
  };

  var testURL = 'http://localhost:3000';

  var model = AuthorizationRule.create({options:options, authorizer:authorizer});

  assert.ok(model.test(testURL));
});

test('Should NOT be valid when hostname is different', function(assert) {
  assert.expect(1);

  var authorizer = {
    ajaxPrefilter:function(){}
  };

  var options = {
    host:'http://differentstrokes:4567'
  };

  var testURL = 'http://localhost:3000';

  var model = AuthorizationRule.create({options:options, authorizer:authorizer});

  assert.ok(!model.test(testURL));
});

test('Should NOT be valid when port is different', function(assert) {
  assert.expect(1);

  var authorizer = {
    ajaxPrefilter:function(){}
  };

  var options = {
    host:'http://localhost:4567'
  };

  var testURL = 'http://localhost:3000';

  var model = AuthorizationRule.create({options:options, authorizer:authorizer});

  assert.ok(!model.test(testURL));
});