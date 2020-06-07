process.env.TEST_ENV = true
const DiscordRSS = require('discord.rss')
const FeedParserError = DiscordRSS.errors.FeedParserError
const RequestError = DiscordRSS.errors.RequestError
const createFeed = require('../../../../../controllers/api/guilds/feeds/createFeed.js')
const guildServices = require('../../../../../services/guild.js')
const feedServices = require('../../../../../services/feed.js')
const createError = require('../../../../../util/createError.js')
const {
  createResponse,
  createNext
} = require('../../../../mocks/express.js')

jest.mock('../../../../../services/guild.js')
jest.mock('../../../../../services/feed.js')
jest.mock('../../../../../util/createError.js')

describe('Unit::controllers/api/guilds/feeds/createFeed', function () {
  beforeEach(function () {
    guildServices.getGuildLimitInfo.mockResolvedValue({})
  })
  afterEach(function () {
    feedServices.createFeed.mockReset()
  })
  it('returns the created feed', async function () {
    const req = {
      params: {},
      body: {}
    }
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }
    const createdFeed = {
      a: 1
    }
    feedServices.createFeed.mockResolvedValue(createdFeed)
    const next = createNext()
    await createFeed(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith(createdFeed)
  })
  it('returns 403 if exceeded feed limit', async function () {
    guildServices.getGuildLimitInfo.mockResolvedValue({
      exceeded: true,
      limit: 10
    })
    const req = {
      params: {},
      body: {}
    }
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }
    const next = createNext()
    const createdError = '2q3t4ewgr'
    createError.mockReturnValue(createdError)
    await createFeed(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
    expect(json).toHaveBeenCalledWith(createdError)
  })
  it('returns 400 if error is already exists in this channel', async function () {
    const req = {
      params: {},
      body: {}
    }
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }
    const createdError = '2q3t4ewgr'
    createError.mockReturnValue(createdError)
    const error = new Error('exists in this channel')
    feedServices.createFeed.mockRejectedValue(error)
    const next = createNext()
    await createFeed(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith(createdError)
  })
  it('returns 500 wiht the created error if feedparser err', async function () {
    const req = {
      params: {},
      body: {}
    }
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }
    const createdError = '2q3t4ewgr'
    createError.mockReturnValue(createdError)
    const error = new FeedParserError()
    feedServices.createFeed.mockRejectedValue(error)
    const next = createNext()
    await createFeed(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith(createdError)
  })
  it('returns 500 wiht the created error if request err', async function () {
    const req = {
      params: {},
      body: {}
    }
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({ json }))
    }
    const createdError = '2q3t4ewgr'
    createError.mockReturnValue(createdError)
    const error = new RequestError()
    feedServices.createFeed.mockRejectedValue(error)
    const next = createNext()
    await createFeed(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith(createdError)
  })
  it('calls next for unrecognized errors', async function () {
    const req = {
      params: {},
      body: {}
    }
    const res = createResponse()
    const error = new Error('srewhtuj')
    feedServices.createFeed.mockRejectedValue(error)
    const next = createNext()
    await createFeed(req, res, next)
    expect(next).toHaveBeenCalledWith(error)
  })
  it('calls the service with the right args', async function () {
    const req = {
      params: {
        guildID: 123
      },
      body: {
        channel: 'aqewtr',
        url: 'q3e2trg'
      }
    }
    const res = createResponse()
    const createdFeed = {
      a: 1
    }
    feedServices.createFeed.mockResolvedValue(createdFeed)
    const next = createNext()
    await createFeed(req, res, next)
    expect(feedServices.createFeed)
      .toHaveBeenCalledWith({
        guild: req.params.guildID,
        channel: req.body.channel,
        url: req.body.url
      })
  })
})
