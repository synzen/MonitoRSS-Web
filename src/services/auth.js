const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const discordAPIConstants = require('../constants/discordAPI.js')

/**
 * @typedef {Object} Session
 * @property {Object} token
 * @property {Object} identity
 */

/**
 * @param {Session} session
 */
function isAuthenticated (session) {
  return !!(session.identity && session.token)
}

/**
  * @param {import('simple-oauth2').OAuthClient} oauthClient
  * @returns {string}
  */
function getAuthorizationURL (config) {
  const scopes = discordAPIConstants.scopes
  const { clientID, redirectURI } = config.bot
  const { tokenHost, authorizePath } = discordAPIConstants.auth
  return `${tokenHost}${authorizePath}?response_type=code&client_id=${clientID}&scope=${scopes}&redirect_uri=${redirectURI}&prompt=consent`
}

/**
 * @param {Object} tokenObject
 */
function tokenIsExpired (tokenObject) {
  const now = new Date()
  const nowEpochSeconds = now.getTime() / 1000
  const expiresAt = tokenObject.expiresAt
  return nowEpochSeconds > expiresAt
}

/**
 * @param {Object} tokenObject
 */
function formatAccessToken (tokenObject) {
  const now = new Date()
  // expiresAt must be in seconds to match expire_in
  const expiresAt = Math.round(now.getTime() / 1000) + tokenObject.expires_in
  const formatted = {
    ...tokenObject,
    expiresAt
  }
  return formatted
}

/**
 * @param {Object} tokenObject
 * @param {Object} config
 */
async function refreshToken (tokenObject, config) {
  const { clientID, clientSecret, redirectURI } = config.bot
  const { scopes, auth } = discordAPIConstants
  const { tokenHost, tokenPath } = auth
  const url = `${tokenHost}${tokenPath}`
  const body = new URLSearchParams({
    client_id: clientID,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: tokenObject.refresh_token,
    redirect_uri: redirectURI,
    scope: scopes
  })
  const res = await fetch(url, {
    method: 'POST',
    body
  })
  if (!res.ok) {
    throw new Error(`Non-200 status code (${res.status}, ${res.statusText})`)
  }
  const json = await res.json()
  return formatAccessToken(json)
}

/**
 * @param {string} code
 * @param {Object} config
 */
async function createAuthToken (code, config) {
  const { clientID, clientSecret, redirectURI } = config.bot
  const { scopes } = discordAPIConstants
  const { tokenHost, tokenPath } = discordAPIConstants.auth
  const body = new URLSearchParams({
    client_id: clientID,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectURI,
    scope: scopes
  })
  const url = `${tokenHost}${tokenPath}`
  const res = await fetch(url, {
    method: 'POST',
    body
  })
  if (!res.ok) {
    throw new Error(`Non-200 status code (${res.status}, ${res.statusText})`)
  }
  const json = await res.json()
  return formatAccessToken(json)
}

/**
 * @param {Object} tokenObject
 * @param {Object} config
 */
async function revokeAuthToken (tokenObject, config) {
  const { clientID, clientSecret } = config.bot
  const { tokenHost, revokePath } = discordAPIConstants.auth
  const accessTokenBody = new URLSearchParams({
    client_id: clientID,
    client_secret: clientSecret,
    token: tokenObject.access_token
  })
  const refreshTokenBody = new URLSearchParams({
    client_id: clientID,
    client_secret: clientSecret,
    token: tokenObject.access_token
  })
  const url = `${tokenHost}${revokePath}`
  const [accessResp, refreshResp] = await Promise.all([
    fetch(url, {
      method: 'POST',
      body: accessTokenBody
    }),
    fetch(url, {
      method: 'POST',
      body: refreshTokenBody
    })
  ])
  if (!accessResp.ok || !refreshResp.ok) {
    throw new Error(`Failed to completely revoke tokens, bad status codes (access_token: ${accessResp.status}, refresh_token: ${refreshResp.ok})`)
  }
}

/**
 * Returns the token if it exists, otherwise refresh and
 * return a new one
 * @param {Object} token
 * @param {Object} config
 */
async function getAuthToken (token, config) {
  if (!tokenIsExpired(token)) {
    return token
  }
  const newAuthToken = await refreshToken(token, config)
  return newAuthToken
}

/**
 * Attach the user's oauth2 token to req
 * @param {Session} session
 * @param {Object} config
 */
async function logout (session, config) {
  await revokeAuthToken(session.token, config)
  return new Promise((resolve, reject) => {
    session.destroy(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  isAuthenticated,
  getAuthorizationURL,
  createAuthToken,
  getAuthToken,
  logout
}
