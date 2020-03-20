const KeyValue = require('discord.rss').KeyValue

async function getFeedConfig () {
  const feedConfig = await KeyValue.get('feedConfig')
  return feedConfig.toJSON()
}

module.exports = {
  getFeedConfig
}
