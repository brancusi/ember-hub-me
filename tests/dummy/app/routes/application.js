import Ember from 'ember';
import ApplicationRouteMixin from 'ember-hub-me/mixins/application-route';

export default Ember.Route.extend(ApplicationRouteMixin, {
  model: function(){
    // return this.store.find('contact');
  }
});