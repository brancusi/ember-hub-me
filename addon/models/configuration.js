import Ember from 'ember';

var defaults = {
  routeAfterAuthentication: 'index',
  requestRefreshToken: true
};

export default Ember.Object.extend({

  //=======================
  // Properties
  //=======================
  /**
   * The Auth0 Client ID
   * @return {String}
   */
  clientID: function(){
    return this.get('env.hubme.clientID');
  }.property('env.hubme.clientID'),

  /**
   * The Auth0 account domain
   * @return {String}
   */
  domain: function(){
    return this.get('env.hubme.domain');
  }.property('env.hubme.domain'),
  
  /**
   * The route to redirect to after authentication
   */
  routeAfterAuthentication: function(){

    if(Ember.isBlank(this.get('env.hubme.routeAfterAuthentication'))){
      return defaults.routeAfterAuthentication;
    }else{
      return this.get('env.hubme.routeAfterAuthentication');
    }
    
  }.property('env.hubme.routeAfterAuthentication'),

  /**
   * Should the app request a refresh token. This will keep
   * the user logged in indefinitely until the logout
   * manually, or the refresh token is revoked.
   */
  requestRefreshToken: function(){
    if(Ember.isBlank(this.get('env.hubme.requestRefreshToken'))){
      return defaults.requestRefreshToken;
    }else{
      return this.get('env.hubme.requestRefreshToken');
    }

  }.property('env.hubme.requestRefreshToken')
  
});