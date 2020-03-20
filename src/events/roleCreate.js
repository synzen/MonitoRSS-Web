const createLogger = require('../util/logger/create.js')
const RedisRole = require('../structs/Role.js')

module.exports = (redisClient) => (role) => {
  RedisRole.utils.recognize(redisClient, role)
    .catch(err => {
      const log = createLogger(role.guild.shard.id)
      log.error(err, `Redis failed to recognize after roleCreate event`)
    })
}
