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
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都為必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errors.push({ message: '此 Email 已經註冊過。' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
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
    }).catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.flash('success_msg', '你已經成功登出。')
  req.logout()
  res.redirect('/users/login')
})

module.exports = router