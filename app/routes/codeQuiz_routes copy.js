// this is the sandbox
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
  // this will find all the code in array
    .then(codeQuizs => {
      return codeQuizs.map(codeQuiz => codeQuiz.toObject())
    })
    // then it will map each element and convert them to object
    .then(codeQuizs => res.status(200).json({ codeQuizs: codeQuizs }))
    // and with this new array, this output json and reponse
    .catch(next)
})

// SHOW
router.get('/codeQuizs/:id', (req, res, next) => {
  // this will find by ide form the params.id
  // if success it will send message of 404 
  // it will bring codeQuix and convert object then json with response
  CodeQuiz.findById(req.params.id)
    .then(handle404)
    .then(codeQuiz => res.status(200).json({ codeQuiz: codeQuiz.toObject() }))
    .catch(next)
})

// CREATE
router.post('/codeQuizs', requireToken, (req, res, next) => {
  // this look in codeQuiz ower and assign to  to user id
  req.body.codeQuiz.owner = req.user.id
  // it will create
  CodeQuiz.create(req.body.codeQuiz)
  // it iwill paa request body codequiz
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
