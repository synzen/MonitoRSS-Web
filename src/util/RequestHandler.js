const { RESTHandler } = require('@synzen/discord-rest')

class RequestHandler {
  constructor (botToken) {
    this.restHandler = new RESTHandler()
    this.botToken = botToken
  }

  async getWithBearer (endpoint, accessToken) {
    const res = await this.restHandler.fetch(`https://discord.com/api${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    })
    if (!res.ok) {
      const error = new Error(`Bad status code (${res.status})`)
      error.response = res
      throw error
    }
    return res.json()
  }

  async getWithBot (endpoint) {
    const res = await this.restHandler.fetch(`https://discord.com/api${endpoint}`, {
      headers: {
        Authorization: `Bot ${this.botToken}`,
        Accept: 'application/json'
      }
    })
    if (!res.ok) {
      const error = new Error(`Bad status code (${res.status})`)
      error.response = res
      throw error
    }
    return res.json()
  }

  async postWithBot (endpoint, body) {
    const res = await this.restHandler.fetch(`https://discord.com/api${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bot ${this.botToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    if (!res.ok) {
      const error = new Error(`Bad status code (${res.status})`)
      error.response = res
      throw error
    }
  }
}

module.exports = RequestHandler
