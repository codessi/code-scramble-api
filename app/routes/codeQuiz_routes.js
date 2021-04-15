const express = require('express')
const passport = require('passport')

const CodeQuiz = require('../models/codeQuiz')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
router.get('/codeQuizs', (req, res, next) => {
  CodeQuiz.find()
  // this will find all the code 
    .then(codeQuizs => {
      return codeQuizs.map(codeQuiz => codeQuiz.toObject())
    })
    // then this will
    .then(codeQuizs => res.status(200).json({ codeQuizs: codeQuizs }))
    .catch(next)
})

// SHOW
router.get('/codeQuizs/:id', (req, res, next) => {
  CodeQuiz.findById(req.params.id)
    .then(handle404)
    .then(codeQuiz => res.status(200).json({ codeQuiz: codeQuiz.toObject() }))
    .catch(next)
})

// CREATE
router.post('/codeQuizs', requireToken, (req, res, next) => {
  req.body.codeQuiz.owner = req.user.id

  CodeQuiz.create(req.body.codeQuiz)
    .then(codeQuiz => {
      res.status(201).json({ codeQuiz: codeQuiz.toObject() })
    })
    .catch(next)
})

// UPDATE
router.patch('/codeQuizs/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.codeQuiz.owner

  CodeQuiz.findById(req.params.id)
    .then(handle404)
    .then(codeQuiz => {
      requireOwnership(req, codeQuiz)

      return codeQuiz.updateOne(req.body.codeQuiz)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/codeQuizs/:id', requireToken, (req, res, next) => {
  CodeQuiz.findById(req.params.id)
    .then(handle404)
    .then(codeQuiz => {
      requireOwnership(req, codeQuiz)
      codeQuiz.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
