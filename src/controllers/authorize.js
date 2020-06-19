const requestIp = require('request-ip')
const authServices = require('../services/auth.js')
const userServices = require('../services/user.js')
const routingServices = require('../services/routing.js')
const createLogger = require('../util/logger/create.js')
const log = createLogger('W')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function authorize (req, res) {
  if (req.query.error === 'access_denied') {
    return res.redirect('/')
  }
  try {
    const config = req.app.get('config')
    const requestHandler = req.app.get('webClientManager').requestHandler
    const authToken = await authServices.createAuthToken(req.query.code, config)
    const identity = await userServices.getUserByAPI(requestHandler, null, authToken.access_token)
    req.session.token = authToken
    req.session.identity = identity
    log.info(`${req.session.identity.id}, ${req.session.identity.username} logged in`)
    const ip = requestIp.getClientIp(req)
    res.redirect(routingServices.getPath(ip) || '/cp')
  } catch (err) {
    log.error(err, 'Failed to authorize Discord')
    res.redirect('/')
  }
}

module.exports = authorize
