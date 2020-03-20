const RedisRole = require('../structs/Role.js')

/**
 * @param {string} roleID
 * @param {import('redis').RedisClient}
 */
async function getRole (roleID, redisClient) {
  const role = await RedisRole.fetch(redisClient, roleID)
  return role ? formatRole(role.toJSON()) : null
}

/**
 * @param {Object<string, any>} roleData
 */
async function formatRole (roleData) {
  return {
    ...roleData,
    hexColor: roleData.hexColor === '#000000' ? '' : roleData.hexColor
  }
}

/**
 * @param {string[]} roleIDs
 * @param {import('redis').RedisClient} redisClient
 */
async function getRoles (roleIDs, redisClient) {
  const resolved = await Promise.all(roleIDs.map(id => getRole(id, redisClient)))
  return resolved.map(formatRole)
    .sort((a, b) => b.position - a.position)
}

/**
 * @param {string} roleID
 * @param {string} guildID
 * @param {import('redis').RedisClient} redisClient
 */
async function isManagerOfGuild (roleID, guildID, redisClient) {
  return RedisRole.utils.isManagerOfGuild(redisClient, roleID, guildID)
}

/**
 * @param {string} roleID
 * @param {string} guildID
 * @param {import('redis').RedisClient} redisClient
 */
async function isRoleOfGuild (roleID, guildID, redisClient) {
  const role = await getRole(roleID, redisClient)
  if (!role) {
    return false
  }
  return role.guildID === guildID
}

/**
 * @param {string} guildID
 * @param {import('redis').RedisClient}
 */
async function getRolesOfGuild (guildID, redisClient) {
  const roleIDs = await RedisRole.utils.getRolesOfGuild(redisClient, guildID)
  const roles = await Promise.all(roleIDs.map(roleID => getRole(roleID, redisClient)))
  return roles.filter(r => r)
}

module.exports = {
  getRole,
  getRoles,
  formatRole,
  isManagerOfGuild,
  isRoleOfGuild,
  getRolesOfGuild
}
