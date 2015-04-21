module.exports = {
  normalizeEntityName: function() {
  },

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'auth0-lock',     target: '~7.4.0'  },
      { name: 'jwt-decode',     target: '~1.1.0'  },
      { name: 'uri.js',         target: '~1.15.0' }
    ]);

  }
};