const express = require('express')
const db = require('../../models')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = db.User
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        console.log('User already exists!')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      }
    }).catch(err => console.log(err))
  return bcrypt.genSalt(10)
    .then(salt => {
      bcrypt.hash(password, salt)
    })
    .then(hash => {
      User.create({
        name,
        email,
        password: hash
      })
    })
    .then(() => res.redirect('/users/login'))
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router