const RedisUser = require('../structs/User.js')
const createLogger = require('../util/logger/create.js')

module.exports = (redisClient) => (oldUser, newUser) => {
  RedisUser.utils.update(redisClient, oldUser, newUser)
    .catch(err => {
      const log = createLogger(newUser.client.shard.ids[0])
      log.error(err, `Redis failed to update after userUpdate event`)
    })
}
