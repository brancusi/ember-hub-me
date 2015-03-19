import Ember from 'ember';

export default Ember.Object.extend({

  hub: Ember.inject.service('hub-me:hub'),

  ajaxPrefilter: function(options, originalOptions, jqXHR){
    /* Adjust the request */
  }

});