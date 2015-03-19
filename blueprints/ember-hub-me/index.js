module.exports = {
  normalizeEntityName: function() {
  },

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'auth0-lock',     target: '~7.1.7'  },
      { name: 'jwt-decode',     target: '~1.0.2'  },
      { name: 'uri.js',         target: '~1.14.2' }
    ]);

  }
};