const Discord = require('discord.js')
const MANAGE_CHANNELS_PERM = Discord.Permissions.FLAGS.MANAGE_CHANNELS
const createLogger = require('../util/logger/create.js')
const RedisGuildMember = require('../structs/GuildMember.js')

module.exports = (redisClient) => (oldMember, newMember) => {
  const oldMemberHas = oldMember.permissions.has(MANAGE_CHANNELS_PERM)
  const newMemberHas = newMember.permissions.has(MANAGE_CHANNELS_PERM)
  if (oldMemberHas !== newMemberHas) {
    if (!newMemberHas) {
      RedisGuildMember.utils.forgetManager(redisClient, newMember)
        .catch(err => {
          const log = createLogger(oldMember.guild.shard.id)
          log.error(err, `Redis failed to forgetManager after guildMemberUpdate event`)
        })
    } else {
      RedisGuildMember.utils.recognizeManager(redisClient, newMember)
        .catch(err => {
          const log = createLogger(oldMember.guild.shard.id)
          log.error(err, `Redis failed to recognizeManager after guildMemberUpdate event`)
        })
    }
  }
}
