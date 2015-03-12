# Ember Hub Me

Ember Hub Me aims to quickly integrate with multiple identity providers using [Auth0](https://auth0.com/).

## What does it do?

* it __manages a client side session__ using [Auth0](https://auth0.com/) and [Lock](https://auth0.com/docs/lock).
* it __authorizes requests__ to backend servers

### Installation

```bash
npm install --save-dev ember-hub-me
```

### Configuration

There are several configuration options.

1. (REQUIRED) - _clientID_ - Grab from your Auth0 Dashboard
2. (REQUIRED) - _domain_ - Grab from your Auth0 Dashboard
3. (OPTIONAL) - _routeAfterAuthentication_ - The route to transition to after authentications. Defaults to ```index```
4. (OPTIONAL) - _requestRefreshToken_ - Should we request a refresh token. If yes, this will keep the user logged in until they manually logout, or the token is revoked. Defaults to ```false```

```js
//environment.js
ENV['hubme'] = {
  clientID: "auth0_client_id",
  domain: "auth0_domain",
  routeAfterAuthentication: "dashboard",
  requestRefreshToken: true
}
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
//app/templates/application.hbs
<a {{action 'login'}} href=''>Login</a>
<a {{action 'logout'}} href=''>Logout</a>
<a {{action 'register'}} href=''>Register</a>
```

```login``` and ```register``` will both call the Auth0 Lock panel for standard user flow.

```logout``` will attempt to destroy the refresh_token if there is one, and then clear all session data. It will then hard reset the window.location to wipe all in memory data.

## Authorization

Now get to the point! Give me protected routes!

This is handled using a mixin as follows:

```js
//app/routes/protected.js
import AuthenticatedRouteMixin from 'ember-hub-me/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ...
});
```

This will force the user to login if not already authenticated.

What about calls to an API? How do I add the right headers?

This is handled by adapter Mixins. Out of the box there is the Oauth Mixin.

```
//app/adapters/contact.js

import DS from 'ember-data';

import OauthAuthorizer from 'ember-hub-me/authorizers/oauth'

export default DS.RESTAdapter.extend(OauthAuthorizer, {
  host: 'http://localhost:4567'
});
```

The Auth0 reccomended approach to managing authorization is as follows.

1. The user authenticates with Auth0.
2. Auth0 returns a [JWT](http://jwt.io/)
3. The client safely stores this jwt
4. With each request to a remote server, we send the jwt along as a header
5. The server validates the jwt using the client secret
6. If all is well in the jwt world, it does all needed authorization logic and sends back the requested or data or a 401 status

So this is how we do it in Ember Hub Me. 

Using the __OauthAuthorizer__, the following header will be sent with all requests for any adapter mixing in the __OauthAuthorizer__.

```
"Authorization": "Bearer _jwt_"
```

By relying on the adapter to manage headers, we can have very fine grained control of how we authorize or default authorization using the mixin with an application adapater as follows:

```
//app/adapters/application.js

import DS from 'ember-data';

import OauthAuthorizer from 'ember-hub-me/authorizers/oauth'

export default DS.RESTAdapter.extend(OauthAuthorizer, {
  host: 'http://localhost:4567'
});
```

This will send the Authorization header with all requests.

_Remember, Auth0 base64 encoded the client secret. you will need to urlsafe base64 decode when validating the jwt on the server or in the client_

### Roadmap

The goal of this addon is to allow the client to simply setup adapters and have all the authentication and authorization for that provider to happen in the background. Auth0 streamlines the authentication part, so the task for Ember Hub Me will be to manage those profiles and plug in the user workflows.

1. Manage state across multiple windows and tabs
2. Allow for linking of providers, fb, github, etc. into the main identity
3. Allow for an adapter to trigger authentication if a 401 is returned


### Tests

I know...