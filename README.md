[![Build Status](https://travis-ci.org/brancusi/ember-hub-me.svg?branch=master)](https://travis-ci.org/brancusi/ember-hub-me)

# Ember Hub Me

Ember Hub Me aims to quickly integrate with multiple identity providers using [Auth0](https://auth0.com/).

## What does it do?

* it __manages a client side session__ using [Auth0](https://auth0.com/) and [Lock](https://auth0.com/docs/lock).
* it __authorizes requests__ to backend servers

### Installation

```bash
npm install --save-dev ember-hub-me
```

### Setup your project

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

## Authorization

Hubme can handle client side route authentication along with sending the correct header info for data sources.


### Client side route authentication

This is handled using a mixin as follows:

```js
//app/routes/protected.js
import AuthenticatedRouteMixin from 'ember-hub-me/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ...
});
```

This will force the user to login if not already authenticated.

### Sending proper request to data sources - XHR Decorating

What about calls to an API? How do I add the right headers?


This is handled by using __authorizers___. Out of the box there is the __OauthAuthorizer__.

1. _Oauth_ - Once authenticated with Auth0, this authorizer will send the following header with all requests matching the hostname.

```
Authorization: "Bearer _auth0-jwt-token_"
```

If the user is not authenticated, no adjust to a request will be made.









The Auth0 reccomended approach to managing authorization is as follows.

1. The user authenticates with Auth0.
2. Auth0 returns a [JWT](http://jwt.io/)
3. The client safely stores this jwt
4. With each request to a remote server, we send the jwt along as a header
5. The server validates the jwt using the client secret
6. If all is well in the jwt world, it does all needed authorization logic and sends back the requested data or a 401 status

So this is how we do it in Ember Hub Me. 

Using the __OauthAuthorizer__, the following header will be sent with all requests for any adapter mixing in the __OauthAuthorizer__.

```HTTP
"Authorization": "Bearer _jwt_"
```

By relying on the adapter to manage headers, we can have very fine grained control of how we authorize or default authorization using the mixin with an application adapater as follows:

```js
//app/adapters/application.js

import DS from 'ember-data';

import OauthAuthorizer from 'ember-hub-me/authorizers/oauth'

export default DS.RESTAdapter.extend(OauthAuthorizer, {
  host: 'http://localhost:4567'
});
```

This will send the Authorization header with all requests.

_Remember, Auth0 base64 encodes the client secret. you will need to urlsafe base64 decode when validating the jwt on the server or in the client_

### Configuration

There are several configuration options.

1. (REQUIRED) - ```clientID``` - Grab from your Auth0 Dashboard
2. (REQUIRED) - ```domain``` - Grab from your Auth0 Dashboard
3. (OPTIONAL) - ```rules``` - Array of rule objects. - {host:localhost, authrorizer:’oauth’}
  1. (REQUIRED) - ```host``` - Hostname to pattern match against, must include protocol: i.e. ```http://localhost```. Port defaults to 80, to set port, simply add to host name: i.e. ```http://localhost:4567```.
  2. (OPTIONAL) - ```authorizer``` - ```Default``` is *oauth*. The name of the authorizer to run when any call is made with the corresponding hostname.
  3. (OPTIONAL) - ```promptLogin``` - ```Default``` is *true*. If the user is not authenticated for this profile, prompt them to sign in if the authorizer requests missing credentials.
3. (OPTIONAL) - ```routeAfterAuthentication``` - The route to transition to after authentications. Defaults to ```index```
4. (OPTIONAL) - ```requestRefreshToken``` - Should we request a refresh token. If yes, this will keep the user logged in until they manually logout, or the token is revoked. Defaults to ```false```

```js
//environment.js
ENV['hubme'] = {
  clientID: "auth0-client-id",
  domain: "auth0-domain",
  routeAfterAuthentication: "dashboard",
  requestRefreshToken: true,
  rules:[
        {host:'http://localhost:4567', authorizer:'oauth', promptLogin:false},
        {host:'https://api.dopeness.com', authorizer:'dope-auth', promptLogin:false}
      ]

}
```

### Roadmap

The goal of this addon is to allow the client to simply setup mappings and have all the authentication and authorization for that provider to happen through Auth0. Auth0 streamlines the authentication part, so the task for Ember Hub Me will be to manage those profiles and plug in the user workflows.

1. Manage state across multiple windows and tabs.
2. Allow for linking of providers, fb, github, etc. into the main identity.
3. Allow for an adapter to trigger authentication if a 401 is returned.
4. Test helpers.
5. Docs.

### Tests

Coverage is very low right now. There are some unit tests for the patter matching, but no end-to-end yet.