import DS from 'ember-data';

import OauthAuthorizer from 'ember-hub-me/authorizers/oauth'

export default DS.RESTAdapter.extend(OauthAuthorizer, {
  host: 'http://localhost:4567'
});