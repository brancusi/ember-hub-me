import Ember from 'ember';

export default Ember.Mixin.create({

  headers: function(){
    var token = "Bearer %@".fmt(this.get('hub.session.jwt')); 
    return {
      "Authorization": token
    };
  }.property()


});