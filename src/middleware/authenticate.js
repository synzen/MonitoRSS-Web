const authServices = require('../services/auth.js')
const createError = require('../util/createError.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authenticate (req, res, next) {
  const config = req.app.get('config')
  if (!authServices.isAuthenticated(req.session)) {
    const error = createError(401, 'Failed discord authorization')
    return res.status(401).json(error)
  }
  try {
    const newToken = await authServices.getAuthToken(req.session.token, config)
    req.session.token = newToken
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = authenticate
