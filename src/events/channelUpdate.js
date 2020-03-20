const Discord = require('discord.js')
const RedisChannel = require('../structs/Channel.js')
const createLogger = require('../util/logger/create.js')

module.exports = (redisClient) => (oldChannel, newChannel) => {
  if (!(newChannel instanceof Discord.GuildChannel) || !(oldChannel instanceof Discord.GuildChannel)) {
    return
  }
  if (oldChannel.name !== newChannel.name) {
    RedisChannel.utils.update(redisClient, oldChannel, newChannel)
      .catch(err => {
        const log = createLogger(oldChannel.guild.shard.id)
        log.error(err, `Redis failed to update name after channelUpdate event`)
      })
  }
}
