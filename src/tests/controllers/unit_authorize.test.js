process.env.TEST_ENV = true
const controller = require('../../controllers/authorize.js')
const authServices = require('../../services/auth.js')
const userServices = require('../../services/user.js')
const routingServices = require('../../services/routing.js')
const {
  createRequest,
  createResponse
} = require('../mocks/express.js')

jest.mock('../../services/auth.js')
jest.mock('../../services/user.js')
jest.mock('../../services/routing.js')
jest.mock('request-ip')

describe('Unit::controllers/authorize', function () {
  it('redirects to / if access denied', async function () {
    const req = createRequest()
    const res = createResponse()
    req.query.error = 'access_denied'
    await controller(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/')
  })
  it('injects the token and identity into session', async function () {
    const token = {
      foo: 1
    }
    const identity = {
      bar: 2
    }
    const req = createRequest()
    req.app.get.mockImplementation((key) => {
      if (key === 'webClientManager') {
        return {}
      }
    })
    const res = createResponse()
    authServices.createAuthToken.mockResolvedValue(token)
    userServices.getUserByAPI.mockResolvedValue(identity)

    await controller(req, res)
    expect(req.session.token).toEqual(token)
    expect(req.session.identity).toEqual(identity)
  })
  it('redirects to the previously saved route if it exists', async function () {
    const req = createRequest()
    const res = createResponse()
    const savedPath = '32qwt54e6ry5t'
    req.app.get.mockImplementation((key) => {
      if (key === 'webClientManager') {
        return {}
      }
    })
    routingServices.getPath.mockReturnValue(savedPath)
    await controller(req, res)
    expect(res.redirect).toHaveBeenCalledWith(savedPath)
  })
  it('redirects to the /cp if saved route does not exist', async function () {
    const req = createRequest()
    const res = createResponse()
    req.app.get.mockImplementation((key) => {
      if (key === 'webClientManager') {
        return {}
      }
    })
    routingServices.getPath.mockReturnValue(null)
    await controller(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/cp')
  })
  it('redirects to / if createAuthToken fails', async function () {
    const req = createRequest()
    const res = createResponse()
    req.app.get.mockImplementation((key) => {
      if (key === 'webClientManager') {
        return {}
      }
    })
    authServices.createAuthToken.mockRejectedValue(new Error())
    await controller(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/')
  })
})
