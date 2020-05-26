const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const RedisGuild = require('./structs/Guild.js')
const RedisUser = require('./structs/User.js')
const getConfig = require('../config.js').get
const connectRedis = require('../util/connectRedis.js')
const createLogger = require('../util/logger/create.js')
const promisify = require('util').promisify
const { once } = require('events')

class WebClient {
  constructor () {
    this.log = createLogger('-')
    this.config = getConfig()
    /**
     * @type {import('redis').RedisClient}
     */
    this.redisClient = null
    process.on('message', message => {
      if (message === 'exit') {
        process.exit(1)
      } else if (message === 'initialize') {
        this.initialize()
      }
    })
  }

  async login (token) {
    try {
      this.redisClient = await connectRedis(this.config, '-')
      this.client = new Discord.Client()
      await this.client.login(token)
      this.log.info(`Discord.RSS-Web logged in as ${this.client.user.username}#${this.client.user.discriminator}`)
      this.log = createLogger(this.client.shard.ids[0])
      this.log.debug('Waiting for client to be ready...')
      await once(this.client, 'ready')
      this.client.on('debug', message => this.log.debug(message))
      this.log.debug('Client is ready, registering listeners...')
      this.onReady()
    } catch (err) {
      this.log.error(err, 'Failed to login Client')
      process.send('exit')
    }
  }

  onReady () {
    this.registerListeners()
    this.log.info('Listeners registered')
    this.client.shard.send('created')
  }

  registerListeners () {
    const redisClient = this.redisClient
    const folderPath = path.join(__dirname, 'events')
    const files = fs.readdirSync(folderPath)
    this.log.trace({
      files
    }, 'Registering listeners found files')
    for (const name of files) {
      const event = name.replace('.js', '')
      const filePath = path.join(folderPath, name)
      this.client.on(event, require(filePath)(redisClient))
      this.log.trace(`Registered listener for event ${event}`)
    }
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

  async initialize () {
    // This will recognize all guild info, members, channels and roles
    const recognizeGuilds = this.client.guilds.cache.map((guild) => {
      return RedisGuild.utils.recognize(this.redisClient, guild)
    })
    const recognizeUsers = this.client.users.cache.map((user) => {
      return RedisUser.utils.recognize(this.redisClient, user)
    })
    this.log.debug('Recognizing guilds and users...')
    await Promise.all(recognizeGuilds.concat(recognizeUsers))
    this.log.debug('Guilds and users successfully recognized')
    this.log.info('Redis initialized')
    this.client.shard.send('complete')
  }
}

module.exports = WebClient
