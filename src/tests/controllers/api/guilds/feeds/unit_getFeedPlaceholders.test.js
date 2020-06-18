process.env.TEST_ENV = true
const getFeedArticles = require('../../../../../controllers/api/guilds/feeds/getFeedArticles.js')
const feedServices = require('../../../../../services/feed.js')
const createError = require('../../../../../util/createError.js')
const {
  createResponse,
  createNext
} = require('../../../../mocks/express.js')

jest.mock('../../../../../services/feed.js')
jest.mock('../../../../../util/createError.js')

describe('Unit::controllers/api/guilds/feeds/getFeedArticles', function () {
  beforeEach(function () {
    feedServices.feedURLHasFailed.mockResolvedValue(false)
  })
  afterEach(function () {
    feedServices.getFeedArticles.mockReset()
    feedServices.feedURLHasFailed.mockReset()
  })
  it('returns 403 if feed url has failed', async function () {
    const req = {
      feed: {},
      guildData: {}
    }
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }
    const createdError = 'q3ew2t4r'
    feedServices.feedURLHasFailed.mockResolvedValue(true)
    createError.mockReturnValue(createdError)
    const next = createNext()
    await getFeedArticles(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
    expect(json).toHaveBeenCalledWith(createdError)
  })
  it('returns the placeholders', async function () {
    const req = {
      feed: {},
      guildData: {}
    }
    const res = createResponse()
    const data = {
      a: 1
    }
    feedServices.getFeedArticles.mockResolvedValue(data)
    const next = createNext()
    await getFeedArticles(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(data)
  })
  it('returns 500 if service fails', async function () {
    const req = {
      feed: {},
      guildData: {}
    }
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }
    const error = new Error('w4ersyg')
    const createdError = 'q3ew2t4r'
    feedServices.getFeedArticles.mockRejectedValue(error)
    createError.mockReturnValue(createdError)
    const next = createNext()
    await getFeedArticles(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith(createdError)
  })
  it('calls the service with the right args', async function () {
    const req = {
      feed: {
        url: '2wq34ety6rh'
      },
      guildData: {
        profile: {
          a: 1
        }
      }
    }
    const res = createResponse()
    feedServices.getFeedArticles.mockResolvedValue()
    const next = createNext()
    await getFeedArticles(req, res, next)
    expect(feedServices.getFeedArticles)
      .toHaveBeenCalledWith(req.feed)
  })
  it('calls the service with config feeds if no guild profile', async function () {
    const req = {
      feed: {
        url: '2wq34ety6rh'
      },
      guildData: {}
    }
    const res = createResponse()
    const next = createNext()
    feedServices.getFeedArticles.mockResolvedValue()
    await getFeedArticles(req, res, next)
    expect(feedServices.getFeedArticles)
      .toHaveBeenCalledWith(req.feed)
  })
})
