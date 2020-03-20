process.env.TEST_ENV = true
const userServices = require('../../../../services/user.js')
const getBot = require('../../../../controllers/api/users/getBot.js')
const createError = require('../../../../util/createError.js')
const {
  createRequest,
  createResponse,
  createNext
} = require('../../../mocks/express.js')

jest.mock('../../../../util/createError.js')
jest.mock('../../../../services/user.js')

describe('Unit::controllers/api/users/getBot', function () {
  afterEach(function () {
    userServices.getUser.mockReset()
  })
  it('returns the bot if it exists', async function () {
    const user = '23w4ey5rthu'
    userServices.getUser.mockResolvedValue(user)
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    req.app.get.mockImplementation((key) => {
      if (key === 'config') {
        return {
          web: {}
        }
      }
    })
    await getBot(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(user)
  })
  it('calls getUser correctly', async function () {
    userServices.getUser.mockResolvedValue()
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    const config = {
      web: {
        clientID: 55
      }
    }
    const redisClient = {
      a: 1
    }
    req.app.get.mockImplementation((key) => {
      if (key === 'config') {
        return config
      } else if (key === 'redisClient') {
        return redisClient
      }
    })
    await getBot(req, res, next)
    expect(userServices.getUser)
      .toHaveBeenCalledTimes(1)
    expect(userServices.getUser)
      .toHaveBeenCalledWith(config.web.clientID, redisClient)
  })
  it('sends the right response if bot not found', async function () {
    userServices.getUser.mockResolvedValue(null)
    const createdError = { s: 1 }
    createError.mockReturnValue(createdError)
    const json = jest.fn()
    const req = createRequest()
    const res = {
      status: jest.fn(() => ({ json }))
    }
    const next = createNext()
    req.app.get.mockImplementation((key) => {
      if (key === 'config') {
        return {
          web: {}
        }
      }
    })
    await getBot(req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith(createdError)
  })
  it('calls next if getUser fails', async function () {
    const error = new Error('esawtg')
    userServices.getUser.mockRejectedValue(error)
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    req.app.get.mockImplementation((key) => {
      if (key === 'config') {
        return {
          web: {}
        }
      }
    })
    await getBot(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(error)
  })
})
