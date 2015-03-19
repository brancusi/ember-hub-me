import Ember from 'ember';

var defaults = {
  routeAfterAuthentication: 'index',
  requestRefreshToken: true,
  defaultAuthorizer: 'oauth'
};

export default Ember.Object.extend({

  //=======================
  // Properties
  //=======================
  
  hubme: function(){
    return this.get('env.hubme');
  }.property('hub'),

  /**
   * The Auth0 Client ID
   * @return {String}
   */
  clientID: function(){
    return this.get('hubme.clientID');
  }.property('hubme.clientID'),

  /**
   * The Auth0 account domain
   * @return {String}
   */
  domain: function(){
    return this.get('hubme.domain');
  }.property('hubme.domain'),

  /**
   * The list of request rules. 
   */
  rules: function(){
    return this.get('hubme.rules');
  }.property('hubme.rules'),
  
  /**
   * The route to redirect to after authentication
   */
  routeAfterAuthentication: function(){
    if(Ember.isBlank(this.get('hubme.routeAfterAuthentication'))){
      return defaults.routeAfterAuthentication;
    }else{
      return this.get('hubme.routeAfterAuthentication');
    }
    
  }.property('hubme.routeAfterAuthentication'),

  /**
   * Should the app request a refresh token. This will keep
   * the user logged in indefinitely until the logout
   * manually, or the refresh token is revoked.
   */
  requestRefreshToken: function(){
    if(Ember.isBlank(this.get('hubme.requestRefreshToken'))){
      return defaults.requestRefreshToken;
    }else{
      return this.get('hubme.requestRefreshToken');
    }

  }.property('hubme.requestRefreshToken'),

  /**
   * The default authorizer to use in authorization rules.
   * @return {string} The resolver friendly name. Will prefix 
   *                  with 'authorizer:' namespace is just module
   *                  name is supplied.
   */
  defaultAuthorizer: function(){
    if(Ember.isBlank(this.get('hubme.defaultAuthorizer'))){
      return defaults.defaultAuthorizer;
    }else{
      return this.get('hubme.defaultAuthorizer');
    }

  }.property('hubme.defaultAuthorizer'),
  
});