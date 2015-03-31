import Ember from 'ember';

export default Ember.Object.extend({

  hub: Ember.inject.service('hub'),

  ajaxPrefilter: function(options /* originalOptions, jqXHR */){
    var token = "Bearer %@".fmt(this.get('hub.session.jwt'));

    if(Ember.isBlank(options.headers)){
      options.headers = {};
    }

    options.headers.Authorization = token;

  }

});
