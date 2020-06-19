const getFeeds = require('./getFeeds.js')
const createFeed = require('./createFeed.js')
const editFeed = require('./editFeed.js')
const deleteFeed = require('./deleteFeed.js')
const getSchedule = require('./getSchedule.js')
const getFeedArticles = require('./getFeedArticles.js')
const getDatabaseArticles = require('./getDatabaseArticles.js')
const sendMessage = require('./sendMessage.js')
const subscribers = require('./subscribers/index.js')

module.exports = {
  getFeeds,
  createFeed,
  editFeed,
  deleteFeed,
  getSchedule,
  getFeedArticles,
  getDatabaseArticles,
  sendMessage,
  subscribers
}
