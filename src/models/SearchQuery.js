const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  query: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 14 // 14 days
  }
})

exports.schema = schema
/** @type {import('mongoose').Model} */
exports.Model = null
