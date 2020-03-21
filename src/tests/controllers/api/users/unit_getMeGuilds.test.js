process.env.TEST_ENV = true
const userServices = require('../../../../services/user.js')
const guildServices = require('../../../../services/guild.js')
const getMeGuilds = require('../../../../controllers/api/users/getMeGuilds.js')
const {
  createResponse,
  createNext
} = require('../../../mocks/express.js')

jest.mock('../../../../services/user.js')
jest.mock('../../../../services/guild.js')

const createRequest = () => ({
  session: {
    identity: {
      id: 123
    },
    token: {
      access_token: 'aesgr'
    }
  },
  app: {
    get: jest.fn()
  }
})

describe('Unit::controllers/api/users/getMeGuilds', function () {
  afterEach(function () {
    userServices.getGuildsByAPI.mockReset()
    userServices.hasGuildPermission.mockReset()
    guildServices.getGuild.mockReset()
  })
  it('only returns guilds with permission', async function () {
    const userGuilds = [{}, {
      joe: 'ho'
    }, {}, {}]
    const guildData = {
      hello: 'world'
    }
    userServices.getGuildsByAPI.mockResolvedValue(userGuilds)
    userServices.hasGuildPermission
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValue(false)
    guildServices.getGuild
      .mockResolvedValueOnce(guildData)
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    await getMeGuilds(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith([guildData])
  })
  it('calls services with the right args', async function () {
    const userGuilds = [{
      id: '2w3t4e',
      joe: 'ho'
    }]
    const guildData = {
      hello: 'world'
    }
    const config = {
      b: 2
    }
    const redisClient = {
      a: 99
    }
    userServices.getGuildsByAPI.mockResolvedValue(userGuilds)
    userServices.hasGuildPermission.mockResolvedValueOnce(true)
    guildServices.getGuild.mockResolvedValue(guildData)
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    req.app.get.mockImplementation((key) => {
      if (key === 'config') {
        return config
      } else if (key === 'redisClient') {
        return redisClient
      }
    })
    await getMeGuilds(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(userServices.getGuildsByAPI)
      .toHaveBeenCalledWith(123, 'aesgr')
    expect(userServices.hasGuildPermission)
      .toHaveBeenCalledWith(userGuilds[0], config, redisClient)
    expect(guildServices.getGuild)
      .toHaveBeenCalledWith(userGuilds[0].id, redisClient)
  })
})
