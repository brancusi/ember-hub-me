import Ember from 'ember';

export default Ember.Object.extend({

  //=======================
  // Computed Properties
  //=======================
  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),

  //=======================
  // Public Methods
  //=======================
  login:function(){

    var _this = this;

    this.get('lock').show({
      popup: true,
      authParams: {
        scope: _this._createScope()
      }
    }, this._handleLockReponse.bind(this));
    
  },

  logout:function(){
    this.get('session').destroySession();
    this._sessionDestroyedHandler();
  },

  register:function(){
    var _this = this;

    this.get('lock').showSignup({
      popup: true,
      authParams: {
        scope: _this._createScope()
      }
    }, this._handleLockReponse.bind(this));
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
  // Protected Methods
  //=======================
  init:function(){
    this.set('lock', new Auth0Lock(this.get('config.clientID'), this.get('config.domain')));
  },

  //=======================
  // Utility Methods
  //=======================
  _createScope: function(){
    var scope = 'openid profile';
    if(this.get('config.requestRefreshToken')){
      scope = scope + " offline_access";
    }

    return scope;
  },

  //=======================
  // Handler Methods
  //=======================
  _handleLockReponse: function(err, profile, jwt, accessToken, state, refreshToken){
    if(err){
      console.log(err);
    }else{
      this.get('session').createSession(profile, jwt, accessToken, refreshToken);
    }
  },
  
  _sessionDestroyedHandler: function() {
    if (!Ember.testing) {
      window.location.replace('/');
    }
  }

});