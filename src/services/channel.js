const RedisChannel = require('../structs/Channel.js')

/**
 * @param {string} channelID
 * @param {import('redis').RedisClient} redisClient
 */
async function getCachedChannel (channelID, redisClient) {
  const channel = await RedisChannel.fetch(redisClient, channelID)
  return channel ? channel.toJSON() : null
}

/**
 * @param {string} guildID
 * @param {import('redis').RedisClient} redisClient
 */
async function getGuildChannels (guildID, redisClient) {
  const channelIDs = await RedisChannel.utils.getChannelsOfGuild(redisClient, guildID)
  const fetches = channelIDs.map(id => getCachedChannel(id, redisClient))
  const channels = await Promise.all(fetches)
  return channels.filter(c => c)
}

module.exports = {
  getCachedChannel,
  getGuildChannels
}
