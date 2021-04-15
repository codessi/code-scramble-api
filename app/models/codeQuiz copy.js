// this sandbox 
const mongoose = require('mongoose')
// mongoose require and const assign by

const codeQuizSchema = new mongoose.Schema({
  // create new construcor of mongoose.Schema  and assign by codeQuizSchema
  // it will take title  text and it will be required and they are string  owner and it's not string. it's called mongoose.Schema.Types.ObjectId  monster sized tiger octopus which will assing Id   owner takes 3 key type ref required 
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('CodeQuiz', codeQuizSchema)
