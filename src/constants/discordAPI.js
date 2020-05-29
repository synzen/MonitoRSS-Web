module.exports = {
  scopes: 'identify%20guilds',
  apiHost: 'https://discord.com/api',
  auth: {
    tokenHost: 'https://discord.com/api',
    tokenPath: '/oauth2/token',
    revokePath: '/oauth2/token/revoke',
    authorizePath: '/oauth2/authorize'
  }
}
