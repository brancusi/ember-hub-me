import Ember from 'ember';

var read = Ember.computed.readOnly;

export default Ember.Object.extend({

  init: function(){
    this._parseOptions();
  },

  //=======================
  // Properties
  //=======================
  /**
   * Is the rule valid
   * @return {Boolean} The rule requires an authenticator and host
   */
  isValid: Ember.computed('host', 'authorizer', function() {
    var valid = true;

    if(!Ember.isBlank(this.get('authorizer'))){
      if(Ember.isBlank(this.get('authorizer').ajaxPrefilter)){
        valid = false;
      }
    }

    if(Ember.isBlank(this.get('host'))){
      valid = false;
    }

    return valid;

  }),

  protocol: read('_protcol'),
  host: read('_host'),
  port: read('_port'),
  forceLogin: read('options.forceLogin'),

  test: function(url){
    var uri = URI.parse(url);
    var isMatch = true;
    
    if(uri.protocol !== this.get('protocol')){
      isMatch = false;
    }

    if(uri.hostname !== this.get('host')){
      isMatch = false;
    }
    
    if((this.get('port')) && (uri.port !== this.get('port'))){
      isMatch = false;
    }

    return isMatch;
  },

  //=======================
  // Properties
  //=======================
  _parseOptions: function(){
    Ember.assert('host cannot be blank', this.get('options.host'));

    var uri = URI.parse(this.get('options.host'));

    Ember.assert('host cannot be blank', uri.hostname);

    Ember.assert('URNs are not support. Please supply a protocol, i.e. http://api.amazing.com', !uri.urn);

    Ember.assert('URIs must have a protocol, i.e. http://api.amazing.com', uri.protocol);

    this.set('_host', uri.hostname);
    this.set('_port', uri.port);
    this.set('_protcol', uri.protocol);
  }

});