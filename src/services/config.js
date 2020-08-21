const MonitoRSS = require('monitorss')
const KeyValue = require('monitorss').KeyValue

async function getFeedConfig () {
  const feedConfig = await KeyValue.get(KeyValue.keys.FEED_CONFIG)
  if (feedConfig) {
    return feedConfig.toJSON().value
  } else {
    return MonitoRSS.schemas.feeds.validate({}).value
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
