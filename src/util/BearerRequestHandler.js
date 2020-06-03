const { Rest, TokenType } = require('@spectacles/rest')

class RequestHandler {
  constructor () {
    /**
     * @type {Map<string, import('@spectacles/rest').Rest>}
     */
    this.restByTokens = new Map()
  }

  createRestClient (accessToken, tokenType) {
    const rest = new Rest(accessToken, {
      tokenType
    })
    this.restByTokens.set(accessToken, rest)
    return rest
  }

  onAccessTokenRevoked (token) {
    this.restByTokens.delete(token)
  }

  getRestClient (token, tokenType) {
    const existingRest = this.restByTokens.get(token)
    if (existingRest) {
      return existingRest
    } else {
      return this.createRestClient(token, tokenType)
    }
  }

  async getWithBearer (endpoint, accessToken) {
    const rest = this.getRestClient(accessToken, TokenType.BEARER)
    return rest.get(endpoint)
  }

  async getWithBot (endpoint, botToken) {
    const rest = this.getRestClient(botToken, TokenType.BOT)
    return rest.get(endpoint)
  }
}

module.exports = RequestHandler
