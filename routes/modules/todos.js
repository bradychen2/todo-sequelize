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
  const { name } = req.body
  return Todo.create()
})

// Get edit page

// Post edit

// Delete

// Get detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})


module.exports = router