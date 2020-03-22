const fs = require('fs')
const mongoose = require('mongoose')
const redis = require('redis')
const createLogger = require('./logger/create.js')

function readDatabaseFiles (config) {
  const BUFFER_CONFIGS = ['sslCA', 'sslCRL', 'sslCert', 'sslKey']
  const buffers = {}
  if (Object.keys(config).length > 0) {
    for (let x = 0; x < BUFFER_CONFIGS.length; ++x) {
      const name = BUFFER_CONFIGS[x]
      if (config[name]) {
        buffers[name] = fs.readFileSync(config[name])
      }
    }
  }
  return buffers
}

function onDatabaseError (type, error, tag) {
  const log = createLogger(tag)
  log.error({
    error
  }, `${type} database encountered error`)
}

module.exports = async (config, tag) => {
  const log = createLogger(tag)
  const userOptions = config.database.connection || {}
  const connOptions = {
    ...userOptions,
    ...readDatabaseFiles(userOptions)
  }
  await mongoose.connect(config.database.uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ...connOptions
  })
  log.info('Connected to MongoDB')
  mongoose.connection.on('error', (err) => {
    onDatabaseError('MongoDB', err, tag)
  })
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
