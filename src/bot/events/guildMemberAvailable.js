const RedisGuildMember = require('../structs/GuildMember.js')
const createLogger = require('../../util/logger/create.js')

module.exports = (redisClient) => (member) => {
  RedisGuildMember.utils.recognize(redisClient, member)
    .catch(err => {
      const log = createLogger(member.guild.shard.id)
      log.error(err, 'Redis failed to recognize after guildMemberAvailable event')
    })
}
