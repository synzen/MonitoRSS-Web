/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function getGuildBackup (req, res) {
  if (req.guildData) {
    res.json(req.guildData)
  } else {
    res.json({})
  }
}

module.exports = getGuildBackup
