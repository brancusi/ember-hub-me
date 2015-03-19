import {
  moduleFor,
  test
} from 'ember-qunit';

import ENV from '../../../config/environment';
import SessionService from 'ember-hub-me/services/session';
import ConfigurationModel from 'ember-hub-me/models/configuration';

// Valid for 100 years
var validJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NSIsImVtYWlsIjoiZXhhbXBsZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY2xpZW50SUQiOiIxMjNjbGllbnRfaWQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zZWN1cmUuZ3JhdmF0YXIuY29tL2F2YXRhci91c2VyaWQucG5nIiwidXNlcl9pZCI6ImF1dGgwfDEyMzQ1NiIsIm5hbWUiOiJleGFtcGxlQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoiYXoiLCJpZGVudGl0aWVzIjpbeyJ1c2VyX2lkIjoiMTA5ODc2NTQzMjEiLCJwcm92aWRlciI6ImF1dGgwIiwiY29ubmVjdGlvbiI6IlVzZXJuYW1lLVBhc3N3b3JkLUF1dGhlbnRpY2F0aW9uIiwiaXNTb2NpYWwiOmZhbHNlfV0sImNyZWF0ZWRfYXQiOiIyMDE1LTAzLTExVDE5OjI5OjQyLjc4NloiLCJnbG9iYWxfY2xpZW50X2lkIjoiMTIzNDU2X2dsb2JhbF9jbGllbnRfaWQiLCJpc3MiOiJodHRwczovL3Rlc3RpbmcuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDEwOTg3NjU0MzIxIiwiYXVkIjoiMTIzY2xpZW50X2lkIiwiZXhwIjo0NTgyMzc2NzYzLCJpYXQiOjE0MjY2OTkwNzJ9.hf3nlK1gHP1-938lp7rxU6JPynAoqN0nUaEFERkJUG4";

//Expired jwt
var invalidJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NSIsImVtYWlsIjoiZXhhbXBsZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY2xpZW50SUQiOiIxMjNjbGllbnRfaWQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zZWN1cmUuZ3JhdmF0YXIuY29tL2F2YXRhci91c2VyaWQucG5nIiwidXNlcl9pZCI6ImF1dGgwfDEyMzQ1NiIsIm5hbWUiOiJleGFtcGxlQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoiYXoiLCJpZGVudGl0aWVzIjpbeyJ1c2VyX2lkIjoiMTA5ODc2NTQzMjEiLCJwcm92aWRlciI6ImF1dGgwIiwiY29ubmVjdGlvbiI6IlVzZXJuYW1lLVBhc3N3b3JkLUF1dGhlbnRpY2F0aW9uIiwiaXNTb2NpYWwiOmZhbHNlfV0sImNyZWF0ZWRfYXQiOiIyMDE1LTAzLTExVDE5OjI5OjQyLjc4NloiLCJnbG9iYWxfY2xpZW50X2lkIjoiMTIzNDU2X2dsb2JhbF9jbGllbnRfaWQiLCJpc3MiOiJodHRwczovL3Rlc3RpbmcuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDEwOTg3NjU0MzIxIiwiYXVkIjoiMTIzY2xpZW50X2lkIiwiZXhwIjoxNDI2Njk5MDcyLCJpYXQiOjE0MjY2OTkwNzJ9.bKqEUvDtbPiPVbfoDW3Fs9y6kj04SGlykBmEN2fYduQ";

// Both signed with secret
var validSecret = "secret";

// Invalid secret
var invalidSecret = "bad_secret";

var config = ConfigurationModel.create({env:ENV});
var session;

module( 'Unit - service:session', {
  beforeEach: function(){
    session = SessionService.create({config:config});
  }
});

test('expired jwt should not validate', function(assert) {
  assert.expect(1);

  assert.ok(!session._validateJWT(invalidJWT));
});

test('non expired jwt should validate', function(assert) {
  assert.expect(1);

  assert.ok(session._validateJWT(validJWT));
});
