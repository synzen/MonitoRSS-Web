const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const DiscordRSS = require('discord.rss')
const setConfig = require('../config.js').set
const expressApp = require('../app.js')
const createLogger = require('../util/logger/create.js')
const connectMongo = require('../util/connectMongo.js')
const connectRedis = require('../util/connectRedis.js')
const setupModels = require('../util/setupModels.js')

class WebClientManager {
  constructor (config) {
    this.shardsSpawned = 0
    // This can throw
    this.log = createLogger('W')
    this.config = setConfig(config)
    process.env.DRSS_CONFIG = JSON.stringify(config)
    /**
     * @type {import('redis').RedisClient}
     */
    this.redisClient = null
    this.manager = new Discord.ShardingManager(path.join(__dirname, 'shard.js'), {
      token: this.config.bot.token
    })
    this.manager.on('shardCreate', (shard) => {
      shard.on('message', message => this.onMessage(message))
    })
  }

  async start () {
    this.log.info('Attempting to connect to databases...')
    await this.ensureDRSSDatabaseConnection()
    this.mongoConnection = await connectMongo(this.config, 'WM')
    this.redisClient = await connectRedis(this.config, 'WM')
    setupModels(this.mongoConnection)
    this.log.info('Databases connected. Spawning shards...')
    const token = this.config.bot.token
    if (!token || token === 'drss_docker_token') {
      throw new Error('No bot token defined')
    }
    await this.manager.spawn()
  }

  async ensureDRSSDatabaseConnection () {
    const uri = this.config.database.uri
    const options = this.config.database.connection
    await DiscordRSS.ensureDatabaseConnection(uri, options)
  }

  onMessage (message) {
    if (message !== 'complete') {
      return
    }
    if (++this.shardsSpawned < this.manager.totalShards) {
      return
    }
    this.startHttp().catch(err => {
      this.log.fatal(err)
      process.exit(1)
    })
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
    const app = await expressApp(this.redisClient, this.config)
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
