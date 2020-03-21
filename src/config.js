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
  config.adminIDs = envArray('DRSS_ADMINIDS') || override.adminIDs || config.adminIDs

  // LOG
  if (!override.log) {
    override.log = {}
  }
  const log = config.log
  const logOverride = override.log
  log.destination = process.env.DRSS_LOG_DESTINATION || logOverride.destination || log.destination

  // BOT
  if (!override.bot) {
    override.bot = {}
  }
  const bot = config.bot
  const botOverride = override.bot
  bot.token = process.env.DRSS_BOT_TOKEN || botOverride.token || bot.token
  bot.redirectURI = process.env.DRSS_BOT_REDIRECTURI || botOverride.redirectURI || bot.redirectURI
  bot.clientID = process.env.DRSS_BOT_CLIENTID || botOverride.clientID || bot.clientID
  bot.clientSecret = process.env.DRSS_BOT_CLIENTSECRET || botOverride.clientSecret || bot.clientSecret

  // DATABASE
  if (!override.database) {
    override.database = {}
  }
  config.database.uri = process.env.MONGODB_URI || process.env.DRSS_DATABASE_URI || override.database.uri || config.database.uri
  config.database.redis = process.env.REDIS_URL || process.env.DRSS_DATABASE_REDIS || override.database.redis || config.database.redis
  config.database.connection = override.database.connection || config.database.connection

  // WEB
  if (!override.web) {
    override.web = {}
  }
  const http = config.http
  const webOverride = override.http
  http.trustProxy = Boolean(process.env.DRSS_HTTP_TRUSTPROXY) || webOverride.trustProxy === undefined ? http.trustProxy : webOverride.trustProxy
  http.sessionSecret = process.env.DRSS_HTTP_SESSIONSECRET || webOverride.sessionSecret || http.sessionSecret
  http.port = Number(process.env.PORT) || Number(process.env.DRSS_HTTP_PORT) || webOverride.port || http.port

  // HTTPS
  if (!override.web.https) {
    override.web.https = {}
  }
  const https = config.https
  const httpsOverride = override.https
  https.enabled = Boolean(process.env.DRSS_HTTPS_ENABLED) || httpsOverride.enabled === undefined ? https.enabled : httpsOverride.enabled
  https.privateKey = process.env.DRSS_HTTPS_PRIVATEKEY || httpsOverride.privateKey || https.privateKey
  https.certificate = process.env.DRSS_HTTPS_CERTIFICATE || httpsOverride.certificate || https.certificate
  https.chain = process.env.DRSS_HTTPS_CHAIN || httpsOverride.chain || https.chain
  https.port = Number(process.env.DRSS_HTTPS_PORT) || httpsOverride.port || https.port

  if (process.env.NODE_ENV !== 'test') {
    schema.validate(config)
  }

  return exports.get()
}

exports.get = () => config
