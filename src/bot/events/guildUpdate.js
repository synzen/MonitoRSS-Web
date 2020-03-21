const RedisGuild = require('../structs/Guild.js')
const createLogger = require('../../util/logger/create.js')

module.exports = (redisClient) => (oldGuild, newGuild) => {
  RedisGuild.utils.update(redisClient, oldGuild, newGuild)
    .catch(err => {
      const log = createLogger(oldGuild.shard.id)
      log.error(err, `Redis failed to update after guildUpdate event`)
    })
}
