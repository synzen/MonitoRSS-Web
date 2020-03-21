const RedisGuildMember = require('../structs/GuildMember.js')
const createLogger = require('../../util/logger/create.js')

module.exports = (redisClient) => (members, guild) => {
  members.forEach(member => {
    RedisGuildMember.utils.recognize(redisClient, member)
      .catch(err => {
        const log = createLogger(member.guild.shard.id)
        log.error(err, `Redis failed to recognize member after guildMembersChunk event`)
      })
  })
}
