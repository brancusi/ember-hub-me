import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-hub-me/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  setupController: function(controller, model){
    controller.set('contacts', this.store.all('contact'));
    controller.set('products', this.store.all('product'));
  },

  model:function(){
    return Ember.RSVP.all([
      this.store.find('contact'),
      this.store.find('contact'),
      this.store.find('contact'),
      this.store.find('product')
      ]);
  }

});
