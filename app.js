const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const db = require('./models')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = 3000
const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  console.log('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
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
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.get('/users/logout', (req, res) => {
  console.log('logout')
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

app.get('/', (req, res) => {
  return Todo.findAll({
    // Transform to JS objects
    raw: true,
    nest: true
  })
    .then((todos) => res.render('index', { todos }))
    .catch(err => res.status(422).json(err))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
