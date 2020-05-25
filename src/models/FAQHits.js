const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  _id: String,
  hits: Number
})

exports.schema = schema
/** @type {import('mongoose').Model} */
exports.Model = null
