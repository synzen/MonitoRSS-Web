const configServices = require('../../services/config.js')
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getConfig (req, res, next) {
  try {
    const feedConfig = await configServices.getFeedConfig()
    res.json(feedConfig)
  } catch (err) {
    next(err)
  }
}

module.exports = getConfig
