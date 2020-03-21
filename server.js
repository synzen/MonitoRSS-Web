const fs = require('fs')
const path = require('path')
const WebClientManager = require('./src/bot/WebClientManager.js')
const configPath = path.join(__dirname, 'settings', 'config.json')
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {}
const createLogger = require('./src/util/logger/create.js')

const manager = new WebClientManager(config)
manager.start()
  .catch((err) => {
    const log = createLogger('WM')
    log.fatal(err)
    process.exit(1)
  })
