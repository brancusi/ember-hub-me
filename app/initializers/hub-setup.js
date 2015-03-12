import Session from 'ember-hub-me/services/session';
import Hub from 'ember-hub-me/services/hub';
import Configuration from 'ember-hub-me/models/configuration';

import ENV from '../config/environment';

export function initialize(container, application) {

  var config = Configuration.create({env:ENV});

  // Register the hub-me modules
  application.register('hub-me:configuration', config, {instantiate: false});
  application.register('hub-me:session', Session);
  application.register('hub-me:hub', Hub);

  // Inject the hell out of them
  application.inject('hub-me:session', 'config', 'hub-me:configuration');
  application.inject('hub-me:hub', 'config', 'hub-me:configuration');
  application.inject('hub-me:hub', 'session', 'hub-me:session');

  application.inject('route', 'hub', 'hub-me:hub');
  application.inject('controller', 'hub', 'hub-me:hub');
  application.inject('adapter', 'hub', 'hub-me:hub');

}

export default {
  name: 'hub-setup',
  initialize: initialize
};