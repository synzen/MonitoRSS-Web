const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const getConfig = require('../config.js').get
const connectDatabases = require('../util/connectDatabases.js')
const createLogger = require('../util/logger/create.js')

class WebClient {
  constructor () {
    this.log = createLogger('-')
    this.config = getConfig()
    /**
     * @type {import('redis').RedisClient}
     */
    this.redisClient = null
  }
  async login (token) {
    try {
      this.redisClient = await connectDatabases(this.config, '-')
      this.client = new Discord.Client()
      await this.client.login(token)
      this.log = createLogger(this.client.shard.ids[0])
      this.registerListeners()
      await this.initialize()
      this.client.shard.send('complete')
    } catch (err) {
      throw err
    }
  }

  registerListeners () {
    const redisClient = this.redisClient
    const folderPath = path.join(__dirname, '..', 'events')
    const files = fs.readdirSync(folderPath)
    for (const name of files) {
      const event = name.replace('.js', '')
      const filePath = path.join(folderPath, name)
      this.client.on(event, require(filePath)(redisClient))
    }
  }

  async initialize () {

  }
}

module.exports = WebClient
