const Discord = require('discord.js')
const RedisRole = require('../structs/Role.js')
const RedisGuildMember = require('../structs/GuildMember.js')
const createLogger = require('../../util/logger/create.js')
const MANAGE_CHANNELS_PERM = Discord.Permissions.FLAGS.MANAGE_CHANNELS

module.exports = (redisClient) => (oldRole, newRole) => {
  const oldRoleHas = oldRole.permissions.has(MANAGE_CHANNELS_PERM)
  const newRoleHas = newRole.permissions.has(MANAGE_CHANNELS_PERM)
  const log = createLogger(newRole.guild.shard.id)
  if (oldRoleHas !== newRoleHas) {
    const newRoleMembers = newRole.members
    if (!newRoleHas) {
      newRoleMembers.forEach(member => {
        RedisGuildMember.utils.forgetManager(redisClient, member)
          .catch(err => log.error(err, 'Redis failed to members.forgetManager after roleUpdate event'))
      })
      RedisRole.utils.forgetManager(redisClient, newRole)
        .catch(err => log.error(err, 'Redis failed to roles.forgetManager after roleUpdate event'))
    } else {
      newRoleMembers.forEach(member => {
        RedisGuildMember.utils.recognizeManager(redisClient, member)
          .catch(err => log.error(err, 'Redis failed to members.recognizeManager after roleUpdate event'))
      })
      RedisRole.utils.recognizeManager(redisClient, newRole)
        .catch(err => log.error(err, 'Redis failed to roles.forgetManager after roleUpdate event'))
    }
  }
  RedisRole.utils.update(redisClient, oldRole, newRole)
    .catch(err => log.error(err, 'Redis failed to update role after roleUpdate event'))
}
