const express = require('express')
const db = require('../../models')
const Todo = db.Todo
const router = express.Router()

router.get('/', (req, res) => {
  const userId = req.user.id
  return Todo.findAll({
    // Transform to JS objects
    raw: true,
    nest: true,
    where: { userId }
  })
    .then((todos) => res.render('index', { todos }))
    .catch(err => res.status(422).json(err))
})

module.exports = router