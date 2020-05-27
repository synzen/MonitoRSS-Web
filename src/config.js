const schema = require('./util/config/schema.js')
const config = schema.defaults

function envArray (name) {
  const value = process.env[name]
  if (!value) {
    return null
  }
  return value.split(',').map(s => s.trim())
}

exports.set = (override) => {
  // ADMIN IDS
  config.adminIDs = envArray('DRSSWEB_ADMINIDS') || override.adminIDs || config.adminIDs

  // LOG
  if (!override.log) {
    override.log = {}
  }
  const log = config.log
  const logOverride = override.log
  log.level = process.env.DRSSWEB_LOG_LEVEL || logOverride.level || log.level
  log.destination = process.env.DRSSWEB_LOG_DESTINATION || logOverride.destination || log.destination

  // BOT
  if (!override.bot) {
    override.bot = {}
  }
  const bot = config.bot
  const botOverride = override.bot
  bot.token = process.env.DRSSWEB_BOT_TOKEN || botOverride.token || bot.token
  bot.redirectURI = process.env.DRSSWEB_BOT_REDIRECTURI || botOverride.redirectURI || bot.redirectURI
  bot.clientID = process.env.DRSSWEB_BOT_CLIENTID || botOverride.clientID || bot.clientID
  bot.clientSecret = process.env.DRSSWEB_BOT_CLIENTSECRET || botOverride.clientSecret || bot.clientSecret

  // DATABASE
  if (!override.database) {
    override.database = {}
  }
  config.database.uri = process.env.MONGODB_URI || process.env.DRSSWEB_DATABASE_URI || override.database.uri || config.database.uri
  config.database.redis = process.env.REDIS_URL || process.env.DRSSWEB_DATABASE_REDIS || override.database.redis || config.database.redis
  config.database.connection = override.database.connection || config.database.connection

  // HTTP
  if (!override.http) {
    override.http = {}
  }
  const http = config.http
  const httpOverride = override.http
  http.trustProxy = Boolean(process.env.DRSSWEB_HTTP_TRUSTPROXY) || httpOverride.trustProxy === undefined ? http.trustProxy : httpOverride.trustProxy
  http.sessionSecret = process.env.DRSSWEB_HTTP_SESSIONSECRET || httpOverride.sessionSecret || http.sessionSecret
  http.port = Number(process.env.PORT) || Number(process.env.DRSSWEB_HTTP_PORT) || httpOverride.port || http.port

  // HTTPS
  if (!override.https) {
    override.https = {}
  }
  const https = config.https
  const httpsOverride = override.https
  https.enabled = Boolean(process.env.DRSSWEB_HTTPS_ENABLED) || httpsOverride.enabled === undefined ? https.enabled : httpsOverride.enabled
  https.privateKey = process.env.DRSSWEB_HTTPS_PRIVATEKEY || httpsOverride.privateKey || https.privateKey
  https.certificate = process.env.DRSSWEB_HTTPS_CERTIFICATE || httpsOverride.certificate || https.certificate
  https.chain = process.env.DRSSWEB_HTTPS_CHAIN || httpsOverride.chain || https.chain
  https.port = Number(process.env.DRSSWEB_HTTPS_PORT) || httpsOverride.port || https.port

  if (process.env.NODE_ENV !== 'test') {
    schema.validate(config)
  }

  // Other
  config.disableCP = override.disableCP || config.disableCP

  return exports.get()
}

exports.get = () => config
