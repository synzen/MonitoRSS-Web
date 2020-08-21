const { Feed, models } = require('monitorss')
const { GeneralStats } = models

/**
 * @param {import('../bot/WebClientManager.js')} webClientManager
 */
function getTotalGuilds (webClientManager) {
  return webClientManager.guildCount
}

async function getFeedCount () {
  const stats = await Feed.Model.collection.distinct('url')
  return stats.length
}

async function getArticleDeliveryCount () {
  const doc = await GeneralStats.Model
    .findById(GeneralStats.TYPES.ARTICLES_SENT).lean().exec()
  return doc
}

module.exports = {
  getTotalGuilds,
  getFeedCount,
  getArticleDeliveryCount
}
