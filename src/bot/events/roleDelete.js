const Discord = require('discord.js')
const RedisRole = require('../structs/Role.js')
const RedisGuildMember = require('../structs/GuildMember.js')
const createLogger = require('../../util/logger/create.js')
const MANAGE_CHANNELS_PERM = Discord.Permissions.FLAGS.MANAGE_CHANNELS

module.exports = (redisClient) => (role) => {
  const log = createLogger(role.guild.shard.id)
  RedisRole.utils.forget(redisClient, role)
    .catch(err => {
      log.error(err, `Redis failed to forget after roleDelete event`)
    })
  if (role.permissions.has(MANAGE_CHANNELS_PERM)) {
    role.members.forEach(member => {
      RedisGuildMember.utils.forgetManager(redisClient, member)
        .catch(err => {
          log.error(err, `Redis failed to forgetManager after roleDelete event`)
        })
    })
  }
}
