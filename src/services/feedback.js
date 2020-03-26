const DiscordRSS = require('discord.rss')

async function createFeedback (userID, username, content) {
  const feedback = new DiscordRSS.models.Feedback.Model({
    type: 'web',
    userID,
    username,
    content
  })

  const saved = await feedback.save()
  return saved.toJSON()
}

module.exports = {
  createFeedback
}
