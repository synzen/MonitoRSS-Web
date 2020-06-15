const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const DiscordRSS = require('discord.rss')
const Supporter = DiscordRSS.Supporter
const setConfig = require('../config.js').set
const expressApp = require('../app.js')
const configServices = require('../services/config.js')
const createLogger = require('../util/logger/create.js')
const connectMongo = require('../util/connectMongo.js')
const connectRedis = require('../util/connectRedis.js')
const setupModels = require('../util/setupModels.js')
const promisify = require('util').promisify

class WebClientManager {
  constructor (config) {
    this.shardsSpawned = 0
    // This can throw
    this.config = setConfig(config)
    this.log = createLogger('W')
    process.env.DRSSWEB_CONFIG = JSON.stringify(config)
    /**
     * @type {import('redis').RedisClient}
     */
    this.redisClient = null
    this.manager = new Discord.ShardingManager(path.join(__dirname, 'shard.js'), {
      token: this.config.bot.token
    })
    this.guildCount = 0
    this.shardsToInitialize = []
    this.shardsInitialized = 0
    this.manager.on('shardCreate', (shard) => {
      shard.on('message', message => {
        this.onMessage(shard, message)
      })
    })
  }

  async start () {
    try {
      this.log.info('Attempting to connect to databases...')
      await this.setupDiscordRSS()
      this.mongoConnection = await connectMongo(this.config, 'WM')
      this.redisClient = await connectRedis(this.config, 'WM')
      setupModels(this.mongoConnection)
      this.log.info('Databases connected')
      this.log.debug('Flushing redis')
      await this.flushRedis()
      this.log.debug('Redis successfully flushed, spawning shards')
      const token = this.config.bot.token
      if (!token || token === 'DRSSWEB_docker_token') {
        throw new Error('No bot token defined')
      }
      await this.manager.spawn()
    } catch (err) {
      if (err.headers) {
        const isJSON = err.headers.get('content-type') === 'application/json'
        const promise = isJSON ? err.json() : err.text()
        promise.then((response) => {
          this.log.error({ response }, 'WebClientManager failed to start. Verify token and observe rate limits.')
        }).catch((parseErr) => {
          this.log.error(err, 'WebClientManager failed to start')
          this.log.error(parseErr, `Failed to parse response from WebClientManager spawn (Status ${err.status})`)
        }).finally(() => {
          this.kill()
        })
      } else {
        this.log.error(err, 'WebClientManager failed to start')
        this.kill()
      }
    }
  }

  kill () {
    this.manager.shards.forEach(shard => {
      shard.kill()
    })
    process.exit(1)
  }

  async flushRedis () {
    const redisClient = this.redisClient
    const keys = await promisify(redisClient.keys)
      .bind(redisClient)('drss*')
    const multi = redisClient.multi()
    if (keys && keys.length > 0) {
      for (const key of keys) {
        multi.del(key)
      }
      return new Promise((resolve, reject) => multi.exec((err, res) => err ? reject(err) : resolve(res)))
    }
  }

  async setupDiscordRSS () {
    if (process.env.DRSS_START === 'bot-web') {
      return
    }
    const uri = this.config.database.uri
    const options = this.config.database.connection
    await DiscordRSS.setupModels(uri, options)
    const [feedConfig, supporterConfig] = await Promise.all([
      configServices.getFeedConfig(),
      configServices.getSupporterConfig()
    ])
    DiscordRSS.config.set({
      feeds: feedConfig,
      [Supporter.keys.ENABLED]: supporterConfig[Supporter.keys.ENABLED],
      [Supporter.keys.REFRESH_RATE]: supporterConfig[Supporter.keys.REFRESH_RATE]
    }, true)
  }

  /**
   *
   * @param {import('discord.js').Shard} shard
   * @param {*} message
   */
  async onMessage (shard, message) {
    this.log.debug({
      shardMessage: message
    }, 'Got message')
    if (message === 'exit') {
      this.kill()
    }
    if (message === 'created') {
      this.shardsToInitialize.push(shard)
      this.log.debug(`Shard ${shard.id} created ${this.shardsToInitialize.length}/${this.manager.totalShards}`)
      if (this.shardsToInitialize.length === this.manager.totalShards) {
        this.log.debug('All shards created')
        this.initializeNextShard()
      }
    } else if (message === 'complete') {
      this.log.debug('Ignoring non-complete message')
      this.log.debug(`Got complete message, progress: ${this.manager.totalShards - this.shardsToInitialize.length}/${this.manager.totalShards}`)
      if (this.shardsToInitialize.length > 0) {
        this.initializeNextShard()
        return
      }
      try {
        await this.pollUpdateTotalGuilds()
        this.log.debug('Starting HTTP server')
        this.startHttp().catch(err => {
          this.log.fatal(err)
          process.exit(1)
        })
      } catch (err) {
        this.log.fatal(err)
        process.exit(1)
      }
    }
  }

  initializeNextShard () {
    this.log.debug({
      shardsToInitialize: this.shardsToInitialize.map(s => s.id)
    }, 'Initializing next shard in queue')
    const firstToInitialize = this.shardsToInitialize.shift()
    firstToInitialize.send('initialize')
  }

  async pollUpdateTotalGuilds () {
    this.guildCount = await this.getTotalGuilds()
    setInterval(async () => {
      try {
        this.guildCount = await this.getTotalGuilds()
      } catch (err) {
        this.log.error(err, 'Failed to update total guild count')
      }
    }, 1000 * 60 * 20) // 20 min
  }

  async getTotalGuilds () {
    const sizes = await this.manager.fetchClientValues('guilds.cache.size')
    const totalGuilds = sizes.reduce((prev, val) => prev + val, 0)
    return totalGuilds
  }

  readHttpsFiles () {
    const config = this.config
    const {
      privateKey,
      certificate,
      chain
    } = config.https
    const key = fs.readFileSync(privateKey, 'utf8')
    const cert = fs.readFileSync(certificate, 'utf8')
    const ca = fs.readFileSync(chain, 'utf8')
    return {
      key,
      cert,
      ca
    }
  }

  async startHttp () {
    const app = expressApp(this, this.config)
    const config = this.config
    // Check variables
    const { port: httpPort } = config.http

    // Create HTTP Server
    const http = require('http').Server(app)
    http.listen(httpPort, () => {
      this.log.info(`HTTP UI listening on port ${httpPort}!`)
    })

    // Create HTTPS Server
    if (config.https.enabled === true) {
      this.startHttps(app)
    }
  }

  startHttps (app) {
    const config = this.config
    const {
      port: httpsPort
    } = config.https
    const httpsFiles = this.readHttpsFiles()
    const https = require('https').Server(httpsFiles, app)
    https.listen(httpsPort, () => {
      this.log.info(`HTTPS UI listening on port ${httpsPort}!`)
    })
  }
}

module.exports = WebClientManager
