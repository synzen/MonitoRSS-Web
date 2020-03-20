const createLogger = require('../util/logger/create.js')
const RedisGuildMember = require('../structs/GuildMember.js')

module.exports = (redisClient) => (member) => {
  RedisGuildMember.utils.forget(redisClient, member)
    .catch(err => {
      const log = createLogger(member.guild.shard.id)
      log.error(err, `Redis failed to forget after guildMemberRemove event`)
    })
}
