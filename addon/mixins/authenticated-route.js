import Ember from 'ember';

export default Ember.Mixin.create({

  beforeModel: function(transition) {
    this._super(transition);

    if (!this.get('hub.isAuthenticated')) {
      this.get('hub').stashTransition(transition);

      transition.abort();
      transition.send('login');
    }
  }

});