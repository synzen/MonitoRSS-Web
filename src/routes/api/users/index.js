const express = require('express')
const usersAPI = express.Router()
const controllers = require('../../../controllers/index.js')

usersAPI.get('/@bot', controllers.api.users.getBot)
usersAPI.use(require('../../../middleware/authenticate.js'))
usersAPI.get('/@me', controllers.api.users.getMe)
usersAPI.get('/@me/guilds', controllers.api.users.getMeGuilds)

module.exports = usersAPI
