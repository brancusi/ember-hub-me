import Ember from 'ember';

export default Ember.Mixin.create({

  //=======================
  // Protected Methods
  //=======================
  beforeModel: function(transition){
    this._super(transition);
    this._setupEventListeners();

    this.get('hub.session').restoreSession();
  },

  //=======================
  // Private Methods
  //=======================
  _setupEventListeners: function(){
    var _this = this;

    this.get('hub.session').on('session_created', function(){
      _this._sessionCreatedHandler();
    });
  },

  //=======================
  // Handler Methods
  //=======================
  _sessionCreatedHandler: function(){
    var stashedTransition = this.get('hub').popStashedTransition();
    if(Ember.isEmpty(stashedTransition)){
      this.transitionTo(this.get('hub.transitionAfterLogin'));
    }else{
      stashedTransition.retry();
    }
    
  },

  //=======================
  // Actions
  //=======================
  actions: {
    login: function() {
      this.get('hub').login();
    },

    logout: function() {
      this.get('hub').logout();
    },

    register: function() {
      this.get('hub').register();
    }
    
  }
});