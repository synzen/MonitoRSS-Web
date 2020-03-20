const roleServices = require('../../../../services/role.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getRoles (req, res, next) {
  const redisClient = req.app.get('redisClient')
  const guildID = req.params.guildID
  try {
    const roles = await roleServices.getRolesOfGuild(guildID, redisClient)
    res.json(roles)
  } catch (err) {
    next(err)
  }
}

module.exports = getRoles
