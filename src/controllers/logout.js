const authServices = require('../services/auth.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function logout (req, res, next) {
  const config = req.app.get('config')
  const requestHandler = req.app.get('webClientManager').requestHandler
  const session = req.session
  try {
    await authServices.logout(requestHandler, session, config)
    res.redirect('/')
  } catch (err) {
    next(err)
  }
}

module.exports = logout
