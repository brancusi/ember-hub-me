module.exports = {
  normalizeEntityName: function() {
  },

  afterInstall: function() {
    return this.addBowerPackageToProject('auth0-lock', '~7.1.7')
    .then(this.addBowerPackageToProject('jwt-decode', '~1.0.2'))
    
  }
};