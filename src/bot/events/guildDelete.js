const RedisGuild = require('../structs/Guild.js')
const createLogger = require('../../util/logger/create.js')

module.exports = (redisClient) => (guild) => {
  const log = createLogger(guild.shard.id)
  RedisGuild.utils.forget(redisClient, guild)
    .catch(err => log.error(err, 'Redis failed to forget after guildDelete event'))
}
