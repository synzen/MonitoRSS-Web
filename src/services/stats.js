const { Feed, models } = require('discord.rss')
const { GeneralStats } = models

/**
 * @param {import('../bot/WebClientManager.js')} webClientManager
 */
function getTotalGuilds (webClientManager) {
  return webClientManager.guildCount
}

async function getFeedCount () {
  const stats = await Feed.Model.collection.stats()
  return stats.count
}

async function getArticleDeliveryCount () {
  const doc = await GeneralStats.Model.findById(GeneralStats.TYPES.ARTICLES_SENT)
  return doc.data
}

module.exports = {
  getTotalGuilds,
  getFeedCount,
  getArticleDeliveryCount
}
