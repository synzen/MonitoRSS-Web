const redis = require('redis')
const createLogger = require('./logger/create.js')

function onDatabaseError (type, error, tag) {
  const log = createLogger(tag)
  log.error({
    error
  }, `${type} database encountered error`)
}

module.exports = async (config, tag) => {
  const log = createLogger(tag)
  const redisClient = redis.createClient(config.database.redis)
  return new Promise((resolve, reject) => {
    redisClient.once('ready', () => {
      log.info('Connected to Redis')
      resolve(redisClient)
    })
    redisClient.on('error', (err) => {
      onDatabaseError('Redis', err, tag)
    })
  })
}
