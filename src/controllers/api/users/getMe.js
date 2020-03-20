const userServices = require('../../../services/user.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getMe (req, res, next) {
  const { identity, token } = req.session
  const redisClient = req.app.get('redisClient')
  try {
    const userCached = await userServices.getUser(identity.id, redisClient)
    if (userCached) {
      return res.json(userCached)
    }
    const data = await userServices.getUserByAPI(identity.id, token.access_token)
    // req.session.identity = data
    res.json(data)
  } catch (err) {
    next(err)
  }
}

module.exports = getMe
