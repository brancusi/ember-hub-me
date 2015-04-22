import Session from 'ember-hub-me/services/session';
import Configuration from 'ember-hub-me/models/configuration';
import AuthorizationRule from 'ember-hub-me/models/authorization-rule';
import Ember from 'ember';

var Hub = Ember.Service.extend(Ember.Evented, {

  //=======================
  // Computed Properties
  //=======================
  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),

  //=======================
  // Public Methods
  //=======================

  /**
   * Bootstrap Hubme. This needs to be called after mapping.
   * 
   */
  bootstrap:function(){
    this._createConfiguration();
    this._createSession();
    this._createAuth0();
    this._setDefaults();
  },

  /**
   * Trigger Login using Auth0 Lock popup
   */
  login:function(){
    this.get('lock').show(this.get('config.showOptions'), this._handleLockReponse.bind(this));
  },

  /**
   * Logout. This will destroy the current session
   * and reset window location to clear temp data.
   *  
   */
  logout:function(){
    this.get('session').destroySession();
    this._sessionDestroyedHandler();
  },

  /**
   * Trigger the Auth0 Lock register popup
   */
  register:function(){
    var _this = this;

    this.get('lock').showSignup({
      popup: true,
      authParams: {
        scope: _this._createScope()
      }
    }, this._handleLockReponse.bind(this));
  },

  /**
   * Create a authorization rule
   * @param  {object} options           The rule options to create a rule with.
   * 
   */
  createAuthorizationRule: function(options){
    var authorizerName = Ember.isBlank(options.authorizer) ? this.get('config.defaultAuthorizer') : options.authorizer;
    var isNamespaced = new RegExp(/:/).test(authorizerName);

    var namespaced = isNamespaced ? authorizerName : "authorizer:" + authorizerName;
    var authorizer = this.container.lookup(namespaced);
    Ember.assert('Could not find an authorizer named: ' + authorizerName, authorizer);

    var rule = AuthorizationRule.create({options:options, authorizer:authorizer});
    
    Ember.assert('The rule is not valid', rule.get('isValid'));

    this.get('_authorizationRules').addObject(rule);
  },

  removeAuthorizationRule: function(rule){
    this.get('_authorizationRules').removeObject(rule);
  },

  stashTransition: function(transition){
    this.set('requestedTransition', transition);
  },

  popStashedTransition: function(){
    var stashedTransition = this.get('requestedTransition');
    this.set('requestedTransition', null);
    return stashedTransition;
  },

  //=======================
  // Private Properties
  //=======================
  _authorizationRules: Ember.A(),

  //=======================
  // Setup Methods
  //=======================
  _createConfiguration: function(){
    this.set('config', Configuration.create({env:this.get('env')}));
  },

  _createSession: function(){
    var session = Session.create({config:this.get('config')});
    this.set('session', session);
  },

  _createAuth0: function(){
    this.set('lock', new Auth0Lock(this.get('config.clientID'), this.get('config.domain')));
  },

  _setDefaults: function(){
    Ember.$.ajaxPrefilter(this._prefilterRules.bind(this));

    this._processConfigRules();
  },

  _processConfigRules: function(){
    var _this = this;
    this.get('config.rules').forEach(function(options){
      _this.createAuthorizationRule(options);
    });
  },

  //=======================
  // Utility Methods
  //=======================
  // _createScope: function(){
  //   var scope = 'openid profile';
  //   if(this.get('config.requestRefreshToken')){
  //     scope = scope + " offline_access";
  //   }

  //   return scope;
  // },

  //=======================
  // Handler Methods
  //=======================
  _prefilterRules: function(options, originalOptions, jqXHR){
    var matchedRules = this.get('_authorizationRules').filter(function(rule){
      return rule.test(options.url);
    });

    matchedRules.forEach(function(rule){
      rule.get('authorizer').ajaxPrefilter(options, originalOptions, jqXHR);
    });
  },

  _handleLockReponse: function(err, profile, jwt, accessToken, state, refreshToken){
    Ember.assert('There was an error logging in', !err);
    this.get('session').createSession(profile, jwt, accessToken, refreshToken);
  },

  _sessionDestroyedHandler: function() {
    if (!Ember.testing) {
      window.location.replace('/');
    }
  }

});

//=======================
// Class Properties
//=======================
Hub.reopenClass({
  //
});

export default Hub;