module.exports = {
  authenticator: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    return res.redirect('/users/login')
  }
}