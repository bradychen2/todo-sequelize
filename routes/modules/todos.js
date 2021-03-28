const express = require('express')
const db = require('../../models')
const Todo = db.Todo
const router = express.Router()

// Get create page
router.get('/new', (req, res) => {
  res.render('new')
})

// Post create
router.post('/', (req, res) => {
  const name = req.body.name
  return Todo.create({
    name,
    UserId: req.user.id
  })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// Get edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id

  return Todo.findOne({ where: { UserId, id } })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
})

// Put edit
router.put('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id

  return Todo.findOne({ where: { UserId, id } })
    .then(todo => {
      if (req.body.isDone) {
        req.body.isDone = 1
      }
      todo = Object.assign(todo, req.body)
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.log(err))
})

// Delete
router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => todo.destroy())
    .then(() => {
      res.redirect('/')
    })
    .catch(err => console.log(err))
})

// Get detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

module.exports = router