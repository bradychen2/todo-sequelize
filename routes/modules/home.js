const express = require('express')
const db = require('../../models')
const Todo = db.Todo
const router = express.Router()

router.get('/', (req, res) => {
  return Todo.findAll({
    // Transform to JS objects
    raw: true,
    nest: true
  })
    .then((todos) => res.render('index', { todos }))
    .catch(err => res.status(422).json(err))
})

module.exports = router