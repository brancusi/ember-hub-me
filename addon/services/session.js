import Ember from 'ember';
         
//=======================
// Constants
//=======================
var HM_REFRESH_TOKEN = 'hub-me-refresh-token';
var HM_ACCESS_TOKEN = 'hub-me-access-token';
var HM_JWT = 'hub-me-jwt';
var HM_PROFILE = 'hub-me-profile';

var SESSION_STATUS_CHANGED_EVENT = 'status_changed';
var SESSION_EXPIRED_EVENT = 'session_expired';
var SESSION_CREATED_EVENT = 'session_created';

var SECOND = 1000;

var read = Ember.computed.readOnly;

export default Ember.Object.extend(Ember.Evented, {

  //=======================
  // Public Properties
  //=======================

  /**
   * Is the current session authenticated.
   * @return {Boolean}
   */
  isAuthenticated:Ember.computed('jwt', function(){
    return !Ember.isBlank(this.get('jwt'));
  }),

  /**
   * The refresh token used to refresh the temporary access key.
   * @return {String}
   */
  refreshToken: read('_refreshToken'),

  /**
   * Is there currently a refresh token
   * @return {Boolean}
   */
  hasRefreshToken: read('refreshToken'),

  /**
   * The access token
   * @return {String}
   */
  accessToken: read('_accessToken'),

  /**
   * Is there currently a refresh token
   * @return {Boolean}
   */
  hasAccessToken: Ember.computed('accessToken', function(){
    return !Ember.isBlank(this.get('accessToken'));
  }),

  /**
   * The current user Auth0 ID
   * @return {String}
   */
  userID: read('_profile.user_id'),

  /**
   * The current session JWT.
   * @return {Base64 url encoded JWT}
   */
  jwt: read('_jwt'),

  /**
   * Is the currently a jwt in store
   * @return {Boolean}
   */
  hasJWT: Ember.computed('jwt', function(){
    return !Ember.isBlank(this.get('jwt'));
  }),

  /**
   * The current auth0 profile
   * @return {Object}
   */
  profile: read('_profile'),

  /**
   * The current user of the session
   * @return {UserModel} The current user of the model
   */
  user: read('_user'),

  //=======================
  // Public Methods
  //=======================
  
  /**
   * Create a new session
   * @param  {Object} profile      The profile returned by Auth0
   * @param  {jwt} jwt             The JWT returned from Auth0
   * @param  {accessToken}         The Auth0 access token
   * @param  {refreshToken}        Optional refresh token
   */
  createSession: function(profile, jwt, accessToken, refreshToken){
    if(refreshToken){
      this._persistItem('_refreshToken', HM_REFRESH_TOKEN, refreshToken);
    }
    
    this._persistItem('_accessToken', HM_ACCESS_TOKEN, accessToken);
    this._persistItem('_profile', HM_PROFILE, profile);
    this._persistJWT(jwt);

    this._notifySessionCreated();
  },

  /**
   * Restore the session from local storage
   */
  restoreSession: function(){
    this._restoreItem('_refreshToken', HM_REFRESH_TOKEN);
    this._restoreItem('_accessToken', HM_ACCESS_TOKEN);
    this._restoreJWT();
    this._restoreItem('_profile', HM_PROFILE);

    if(this.get('isAuthenticated')){
      this._notifySessionCreated();
    }
  },

  /**
   * Set the user of the current session
   * @param {UserModel} user The user to store with this session
   */
  setUser: function(user){
    this.set('_user', user);
  },

  /**
   * Clear the current user from the session
   */
  clearUser: function(){
    this.set('_user', null);
  },

  /**
   * Destroy the current session and destroy the refresh token
   */
  destroySession: function(){
    var _this = this;

    this.clearUser();
    this._clearJobQueue();

    if(this.get('hasRefreshToken')){
      this._revokeAccessToken().then(function(){
        _this._clearSessionData();
      }, function(){
        console.log('Logout failed but still destroying session data');
        _this._clearSessionData();
      });
    }else{
      this._clearSessionData();
      this._notifySessionExpired();
    }
  },

  _clearSessionData: function(){
    this._clearItem('_accessToken', HM_ACCESS_TOKEN);
    this._clearItem('_refreshToken', HM_REFRESH_TOKEN);
    this._clearItem('_jwt', HM_JWT);
    this._clearItem('_profile', HM_PROFILE);
  },

  //=======================
  // Override Methods
  //=======================
  init: function(){
    this._setup();
  },

  //=======================
  // Private Methods
  //=======================
  _setup: function(){
    this.set('_scheduledJobCollection', Ember.A());
  },

  _isJWTValid: function(){
    return this._validateJWT(this.get('jwt'));
  },

  _jwtRemainingTime: function(){
    return this._calculateJWTTime(this.get('jwt'));
  },

  _persistJWT: function(jwt){
    if(this._validateJWT(jwt)){
      this._persistItem('_jwt', HM_JWT, jwt);
    }

    this._determineLifespan();
  },

  _restoreJWT: function(){
    this._restoreItem('_jwt', HM_JWT);

    if(this.get('hasJWT')){
      this._determineLifespan();  
    }
    
  },

  _persistItem: function(memoryKey, storageKey, data){
    this.set(memoryKey, data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  },

  _restoreItem: function(memoryKey, storageKey){
    var json = localStorage.getItem(storageKey);
    if(!Ember.isBlank(json)){
      this.set(memoryKey, JSON.parse(json));
    }
  },

  _clearItem: function(memoryKey, storageKey){
    this.set(memoryKey, null);
    localStorage.removeItem(storageKey);
  },

  _determineLifespan: function(){
    this._clearJobQueue();

    if(this._isJWTValid()){

      if(this.get('hasRefreshToken')){
        this._scheduleRefresh();
      }

      this._scheduleExpire();

    }else{

      if(this.get('hasRefreshToken')){
        this._scheduleRefresh();
      }else{
        this.destroySession();  
      }
      
    }

  },

  _scheduleRefresh: function(){
    var remaining = this._jwtRemainingTime();
    
    var refreshIn = 0;

    refreshIn = remaining/2;

    if(remaining <= 0){
      refreshIn = 0;
    }
    
    this._scheduleJob(this, this._refreshAccessToken, refreshIn);
  },

  _scheduleExpire: function(){
    this._scheduleJob(this, this._processSessionExpired, this._jwtRemainingTime());
  },

  _scheduleJob: function(scope, callback, time){
    var job = Ember.run.later(scope, callback, time);
    this.get('_scheduledJobCollection').addObject(job);
  },

  _clearJobQueue: function(){

    var queue = this.get('_scheduledJobCollection');
    queue.forEach(function(job){
      Ember.run.cancel(job);
    });

    queue.clear();
  },

  _processSessionExpired: function(){
    this.destroySession();
  },

  _refreshAccessToken:function(){
    
    var data  = { 
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', 
      refresh_token: this.get('refreshToken'),
      client_id: this.get('config.clientID'),
      scope: 'openid profile',
      api_type: 'app',
      target: this.get('config.clientID'),
      id_token: this.get('jwt')
    };
    
    var url = "https://"+this.get('config.domain')+"/delegation";
    
    return Ember.$.ajax(url, {type:"POST", data:data}).
    then(this._processRefreshSuccess.bind(this), this._processRefreshError.bind(this));
      
  },

  /**
   * Revoke the Auth0 refresh token
   * Read more: https://auth0.com/docs/api#!#delete--api-users--user_id--refresh_tokens--refresh_token-
   */
  _revokeAccessToken: function(){
    var headers = {
      "Authorization": "Bearer " + this.get('jwt')
    };
    
    var url = "https://"+this.get('config.domain')+"/api/users/"+this.get('userID')+"/refresh_tokens/"+this.get('refreshToken');
    
    return Ember.$.ajax(url, {type:"DELETE", headers:headers});
  },

  //=======================
  // Event Handlers
  //=======================
  _processRefreshSuccess: function(response){
    this._persistJWT(response.id_token);
  },
  
  _processRefreshError: function(error){
    if(error.status === 401){
      this.destroySession();
    }
  },

  //=======================
  // Notification Methods
  //=======================
  _notifySessionCreated: function(){
    this.trigger(SESSION_STATUS_CHANGED_EVENT, 'logged_in');
    this.trigger(SESSION_CREATED_EVENT);
  },

  _notifySessionExpired: function(){
    this.trigger(SESSION_STATUS_CHANGED_EVENT, 'logged_out');
    this.trigger(SESSION_EXPIRED_EVENT);
  },

  //=======================
  // Utility Methods
  //=======================
  _validateJWT: function(jwt){
    if(!jwt){
      return false;
    }

    try {
      jwt_decode(jwt);
    } catch(err) {
      return false;
    }

    if(this._calculateJWTTime(jwt) <= 0){
      return false;
    }

    return true;
  },

  _calculateJWTTime: function(jwt){
    if(!jwt){
      return 0;
    }

    try {
      var decodedJWT = jwt_decode(jwt);
      // Jwt exp is in second so convert to milli
      var currentTime = (new Date().getTime()/SECOND);

      if (decodedJWT.exp > currentTime) {
        // Everything else is in milli so convert back as milli
        return (decodedJWT.exp - currentTime) * SECOND;
      } else {
        return 0;
      }

    } catch(err) {
      return 0;
    }
    
  }

});
