const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  data: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 15 // 15 minutes
  }
})

exports.schema = schema
/** @type {import('mongoose').Model} */
exports.Model = null
