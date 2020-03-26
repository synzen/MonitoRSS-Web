const WebCache = require('../models/WebCache.js')

/**
 * Set up Mongo DB models
 *
 * @param {import('mongoose').Connection} connection
 */
function setupModels (connection) {
  WebCache.Model = connection.model('web_cache', WebCache.schema)
}

module.exports = setupModels
