const morgan = require('morgan')
const express = require('express')
const session = require('express-session')
const compression = require('compression')
const RedisStore = require('connect-redis')(session)
const routes = require('./routes/index.js')
const requestIp = require('request-ip')
const createLogger = require('./util/logger/create.js')
const app = express()

module.exports = async (redisClient, config) => {
  const log = createLogger('W')
  if (config.http.trustProxy) {
    app.enable('trust proxy')
  }

  // Redirect from HTTP to HTTPS if HTTPS enabled
  if (config.https.enabled) {
    app.use(function (req, res, next) {
      if (!req.secure) {
        res.redirect('https://' + req.headers.host + req.url)
      } else {
        next()
      }
    })
  }

  app.use(compression())
  app.use(express.json())

  // Sessions
  const session = require('express-session')({
    secret: config.http.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.https.enabled }, // Set secure to true for HTTPS - otherwise sessions will not be saved
    maxAge: 1 * 24 * 60 * 60, // 1 day
    store: new RedisStore({
      client: redisClient // Recycle connection
    })
  })
  app.use(session)

  if (process.env.NODE_ENV !== 'test') {
    // Logging
    app.use(morgan(function (tokens, req, res) {
      const custom = []
      if (req.session && req.session.identity) {
        custom.push(`(U: ${req.session.identity.id}, ${req.session.identity.username})`)
      }
      const arr = [
        requestIp.getClientIp(req),
        ...custom,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
      ]
      return arr.join(' ')
    }, {
      stream: {
        write: message => log.info(message.trim())
      }
    }))
  }

  // Application-specific variables
  app.set('config', config)
  app.set('redisClient', redisClient)

  // Routes
  app.use(routes)

  return app
}
