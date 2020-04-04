const Discord = require('discord.js')
const RedisChannel = require('../structs/Channel.js')
const createLogger = require('../../util/logger/create.js')

module.exports = (redisClient) => (channel) => {
  if (!(channel instanceof Discord.GuildChannel)) {
    return
  }
  RedisChannel.utils.forget(redisClient, channel)
    .catch(err => {
      const log = createLogger(channel.guild.shard.id)
      log.error(err, 'Redis failed to forget after channelDelete event')
    })
}
