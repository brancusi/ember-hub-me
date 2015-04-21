import Ember from 'ember';

var defaults = {
  routeAfterAuthentication: 'index',
  requestRefreshToken: true,
  defaultAuthorizer: 'oauth'
};

var read = Ember.computed.readOnly;

export default Ember.Object.extend({

  //=======================
  // Properties
  //=======================

  hubme: read('env.hubme'),

  /**
   * The Auth0 Client ID
   * @return {String}
   */
  clientID: read('hubme.clientID'),

  /**
   * The Auth0 account domain
   * @return {String}
   */
  domain: read('hubme.domain'),

  /**
   * The list of request rules. 
   */
  rules: read('hubme.rules'),
  
  /**
   * The route to redirect to after authentication
   */
  routeAfterAuthentication: Ember.computed('hubme.routeAfterAuthentication', function(){
    if(Ember.isBlank(this.get('hubme.routeAfterAuthentication'))){
      return defaults.routeAfterAuthentication;
    }else{
      return this.get('hubme.routeAfterAuthentication');
    }
  }),

  /**
   * Should the app request a refresh token. This will keep
   * the user logged in indefinitely until the logout
   * manually, or the refresh token is revoked.
   */
  requestRefreshToken: Ember.computed('hubme.requestRefreshToken', function(){
    if(Ember.isBlank(this.get('hubme.requestRefreshToken'))){
      return defaults.requestRefreshToken;
    }else{
      return this.get('hubme.requestRefreshToken');
    }
  }),

  /**
   * The default authorizer to use in authorization rules.
   * @return {string} The resolver friendly name. Will prefix 
   *                  with 'authorizer:' namespace is just module
   *                  name is supplied.
   */
  defaultAuthorizer: Ember.computed('hubme.defaultAuthorizer', function(){
    if(Ember.isBlank(this.get('hubme.defaultAuthorizer'))){
      return defaults.defaultAuthorizer;
    }else{
      return this.get('hubme.defaultAuthorizer');
    }
  })

    
  
});