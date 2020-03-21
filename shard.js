const WebClient = require('./src/bot/WebClient.js')
const passedConfig = JSON.parse(process.env.DRSS_CONFIG)
const config = require('./src/config.js').set(passedConfig)

const drss = new WebClient()

drss.login(config.bot.token)
