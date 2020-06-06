const DiscordRSS = require('discord.rss')
const KeyValue = require('discord.rss').KeyValue

async function getFeedConfig () {
  const feedConfig = await KeyValue.get(KeyValue.keys.FEED_CONFIG)
  if (feedConfig) {
    return feedConfig.toJSON().value
  } else {
    return DiscordRSS.schemas.feeds.validate({}).value
  }
}

async function getSupporterConfig () {
  const supporterConfig = await KeyValue.get(KeyValue.keys.SUPPORTER_CONFIG)
  if (supporterConfig) {
    return supporterConfig.toJSON().value
  } else {
    return {}
  }
}

module.exports = {
  getFeedConfig,
  getSupporterConfig
}
