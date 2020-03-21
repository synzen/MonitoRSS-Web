const fs = require('fs')
const path = require('path')
const WebClientManager = require('./src/structs/WebClientManager.js')
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings', 'config.json')))
const createLogger = require('./src/util/logger/create.js')

const manager = new WebClientManager(config)
manager.start()
  .catch((err) => {
    const log = createLogger('WM')
    log.fatal(err)
    process.exit(1)
  })
