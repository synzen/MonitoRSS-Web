const WebCache = require('../models/WebCache.js')
const FAQHits = require('../models/FAQHits.js')
const SearchQuery = require('../models/SearchQuery.js')

/**
 * Set up Mongo DB models
 *
 * @param {import('mongoose').Connection} connection
 */
function setupModels (connection) {
  WebCache.Model = connection.model('web_cache', WebCache.schema)
  FAQHits.Model = connection.model('faq_hits', FAQHits.schema)
  SearchQuery.Model = connection.model('search_queries', SearchQuery.schema)
}

module.exports = setupModels
