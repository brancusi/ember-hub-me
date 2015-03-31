/* jshint node: true */

module.exports = function(environment) {

  var ENV = {
    modulePrefix: 'dummy',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'font-src': "'self' data: cdn.auth0.com",
      'style-src': "'self' 'unsafe-inline'",
      'script-src': "'self' http://localhost:4567 'unsafe-eval' *.auth0.com",
      'img-src': '*.gravatar.com *.wp.com',
      'connect-src': "'self' http://localhost:4567 *.auth0.com"
    }

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV['hubme'] = {
      clientID: "client-id",
      domain: "auth0-domain",
      rules:[
        {host:'http://localhost:3000'}
      ]
    }

  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV['hubme'] = {
      clientID: "123client_id",
      domain: "testing.auth0.com",
      defaultAuthorizer: "oauth",
      rules:[
        {host:'http://localhost:3000'}
      ]
    }
  }

  if (environment === 'production') {

  }

  return ENV;
};
