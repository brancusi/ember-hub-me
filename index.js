/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-hub-me',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/auth0-lock/build/auth0-lock.min.js');
    app.import(app.bowerDirectory + '/jwt-decode/build/jwt-decode.min.js');
    app.import(app.bowerDirectory + '/uri.js/src/URI.min.js');
  }
  
};