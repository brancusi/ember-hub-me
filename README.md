[![Build Status](https://travis-ci.org/brancusi/ember-hub-me.svg?branch=master)](https://travis-ci.org/brancusi/ember-hub-me)

# Warning, very much under flux. Do not use right now.

# Ember Hub Me

Ember Hub Me aims to quickly integrate with multiple identity providers using [Auth0](https://auth0.com/).

## What does it do?

* it __manages a client side session__ using [Auth0](https://auth0.com/) and [Lock](https://auth0.com/docs/lock).
* it __authorizes requests__ to backend servers

## Installation

```bash
npm install --save-dev ember-hub-me
```

### Setup your project

## Configuration

There are several configuration options.

1. (REQUIRED) - _clientID_ - Grab from your Auth0 Dashboard
2. (REQUIRED) - _domain_ - Grab from your Auth0 Dashboard
3. (OPTIONAL) - _rules_ - Array of rule objects. - {host:'http://localhost', authrorizer:’oauth’}
  1. (REQUIRED) - _host_ - The hostname to pattern match against. Must defined protocol (_http_, _https_) and port(_if different than 80_).
  2. (OPTIONAL) - _authorizer_ - *Default* is _oauth_. The name of the authorizer to run when any call is made with the corresponding hostname.
  3. (OPTIONAL) - _prompt_ - *Default* is _true_. If the user is not authenticated for this profile, prompt them to sign in.
3. (OPTIONAL) - _routeAfterAuthentication_ - The route to transition to after authentications. Defaults to ```index```
4. (OPTIONAL) - _requestRefreshToken_ - Should we request a refresh token. If yes, this will keep the user logged in until they manually logout, or the token is revoked. Defaults to ```false```

```js
//environment.js
ENV['hubme'] = {
  clientID: "auth0_client_id",
  domain: "auth0_domain",
  routeAfterAuthentication: "dashboard",
  requestRefreshToken: true,
  rules:[
        {host:'http://api.myapp.com'},
        {host:'http://api.otherapp.com', authorizer:'my-custom-authorizer'}
      ]
}
```

## Routes

To work properly, you must use the ```application_route_mixin``` with your application route.

```js
//app/routes/application.js
import ApplicationRouteMixin from 'ember-hub-me/mixins/application-route';

export default Ember.Route.extend(ApplicationRouteMixin, {
   ... 
});
```

Ember Hub Me currently uses ```Auth0 Lock``` in popup mode. For this reason there are no additional routes required for the login process.

## Actions

Once the ```application_route_mixin``` is added to your app route, you will be able to call the following actions:

```html
<!-- app/templates/application.hbs -->
<a {{action 'login'}} href=''>Login</a>
<a {{action 'logout'}} href=''>Logout</a>
<a {{action 'register'}} href=''>Register</a>
```

```login``` and ```register``` will both call the Auth0 Lock panel for standard user flow.

```logout``` will attempt to destroy the refresh_token if there is one, and then clear all session data. It will then hard reset the window.location to wipe all in memory data.

## Client side route authentication

This is handled using a mixin as follows:

```js
//app/routes/protected.js
import AuthenticatedRouteMixin from 'ember-hub-me/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ...
});
```

This will force the user to login if not already authenticated. This will happen before the ```model``` hook is invoked.

## Sending authorization headers with requests

What about sending authorization info with requests? How do I add the right headers?

This is handled by using __authorizers__. Out of the box there is the __OauthAuthorizer__.

Hub Me works by pattern matching against all requests using jquery's ```Ember.$.ajaxPrefilter(...);``` function. Rules can be defined at author time via the environment file, or at runtime via the ```hub.createAuthorizationRule(options)``` function.

## Defining rules in environment.js

```js
//environment.js
ENV['hubme'] = {
  clientID: "auth0_client_id",
  domain: "auth0_domain",
  routeAfterAuthentication: "dashboard",
  requestRefreshToken: true,
  rules:[
        {host:'http://api.myapp.com'},
        {host:'http://api.otherapp.com', authorizer:'my-custom-authorizer'}
      ]
}
```

It is important to define the complete url, including the ```protocol``` and ```port``` if different than ```80```

## Defining rules at runtime

```hub``` in injected on all routes, controllers, and adapters.

```js
//controllers/index.js

init: function(){
  this.get('hub').createAuthorizationRule({host:'http://localhost:4567', authorizer:'sinatra-auth'});
  this.get('hub').createAuthorizationRule({host:'http://localhost:3000', authorizer:'express-auth'});
}

```

## Custom Authorizers
```js
//authorizers/custom-auth.js

import Ember from 'ember';

export default Ember.Object.extend({
  
  //Inject stuff
  hub: Ember.inject.service('hub'),

  //This function will get called when a match is found
  ajaxPrefilter: function(options /* originalOptions, jqXHR */){
    var token = "Bearer %@".fmt(this.get('hub.session.jwt'));

    if(Ember.isBlank(options.headers)){
      options.headers = {};
    }

    options.headers.Authorization = token;

  }

});

```

```js
//initializers/custom-auth.js
import CustomAuth from 'authorizers/custom-auth';

export function initialize(container, application) {

  // Add the authorizer to the authorizer namespace
  application.register('authorizer:custom-auth', CustomAuth);
}

export default {
  name: 'custom-auth',
  initialize: initialize
};
```

## Authorizers
1. _Oauth_ authorizer - Once authenticated with Auth0, this authorizer will send the following header with all requests matching the hostname.

```
Authorization: "Bearer jwt"
```

If the user is not authenticated, no adjustment to a request will be made.

This is the flow of client/server authentication used by hubme.

1. The user authenticates with Auth0.
2. Auth0 returns a [JWT](http://jwt.io/) signed by the client secret
3. The client safely stores this jwt
4. With each request to a remote server, we send the jwt along in the Authorization header
5. The server validates the jwt using the client secret and expiration
6. If all is well in the jwt world, it does all needed authorization logic and sends back the requested data or a 401 status

_Remember, Auth0 base64 encodes the client secret. you will need to urlsafe base64 decode when validating the jwt on the server or in the client_

### Roadmap

The goal of this addon is to allow the client to simply setup rules, and have all the authentication and authorization for that host happen in the background. Auth0 streamlines the authentication part, so the task for Ember Hub Me will be to manage those profiles and plug in the user workflows.

1. Complete test coverage
2. Manage state across multiple windows and tabs
3. Allow for linking of providers, fb, github, etc. into the main identity
4. Allow for an adapter to trigger authentication if a 401 is returned on specific host
5. Create authorizers for many identity providers
6. Options to combine identities through Auth0
