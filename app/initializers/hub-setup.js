import Hub from 'ember-hub-me/services/hub';
import ENV from '../config/environment';

// Authorizers
import OauthAuthorizer from 'ember-hub-me/authorizers/oauth';

export function initialize(container, application) {

  var hub = Hub.create({env:ENV, container:container});

  // First register all built in authorizers
  application.register('authorizer:oauth', OauthAuthorizer);

  application.register('service:hub', hub, {instantiate: false});

  application.inject('route', 'hub', 'service:hub');
  application.inject('controller', 'hub', 'service:hub');
  application.inject('adapter', 'hub', 'service:hub');

  // Starts up the hub
  hub.bootstrap();
}

export default {
  name: 'hub-setup',
  initialize: initialize
};
