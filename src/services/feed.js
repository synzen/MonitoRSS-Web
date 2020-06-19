const Discord = require('discord.js')
const DiscordRSS = require('discord.rss')
const Article = DiscordRSS.Article
const ArticleMessage = DiscordRSS.ArticleMessage
const FeedFetcher = DiscordRSS.FeedFetcher
const FailRecord = DiscordRSS.FailRecord
const Feed = DiscordRSS.Feed
const FeedData = DiscordRSS.FeedData
const configServices = require('./config.js')

/**
 * @param {import('discord.rss').Feed} feed
 */
async function getFeedArticles (feed) {
  const { articleList } = await FeedFetcher.fetchFeed(feed.url)
  const allPlaceholders = []
  if (articleList.length === 0) {
    return {
      articles: [],
      placeholderArticles: []
    }
  }
  const feedData = await FeedData.ofFeed(feed)
  for (const article of articleList) {
    const parsed = new Article(article, feedData)
    allPlaceholders.push(parsed.toJSON())
  }
  return {
    articles: articleList,
    placeholderArticles: allPlaceholders
  }
}

/**
 *
 * @param {string} feedURL
 */
async function getAnonymousFeedPlaceholders (feedURL) {
  const feedConfig = await configServices.getFeedConfig()
  const dummyFeed = new Feed({
    ...feedConfig,
    guild: '1',
    channel: '1',
    url: feedURL
  })
  return module.exports.getFeedArticles(dummyFeed)
}

/**
 * @param {string} guildID
 * @param {string} feedID
 * @returns {Feed|null}
 */
async function getFeedOfGuild (guildID, feedID) {
  return Feed.getByQuery({
    _id: feedID,
    guild: guildID
  })
}

/**
 * @param {Object<string, any>} data
 */
async function createFeed (data) {
  const feed = new Feed(data)
  await feed.testAndSave()
  return feed.toJSON()
}

/**
 * @param {string} feedID
 * @param {Object<string, any>} data
 */
async function editFeed (feedID, data) {
  const feed = await Feed.get(feedID)
  for (const key in data) {
    feed[key] = data[key]
  }
  await feed.save()
  return feed.toJSON()
}

/**
 * @param {string} feedID
 */
async function deleteFeed (feedID) {
  const feed = await Feed.get(feedID)
  if (!feed) {
    return
  }
  await feed.delete()
}

/**
 * @param {import('../../structs/db/Feed.js')} feed
 */
async function getDatabaseArticles (feed) {
  // Schedule name must be determined
  const schedule = await feed.determineSchedule()
  const data = await DiscordRSS.models.Article.Model.find({
    scheduleName: schedule.name,
    feedURL: feed.url
  }).lean().exec()
  return data
}

/**
 * @param {string} url
 */
async function getFailRecord (url) {
  const record = await FailRecord.get(url)
  return record ? record.toJSON() : null
}

/**
 * @param {string} url
 */
async function feedURLHasFailed (url) {
  const feedsConfig = await configServices.getFeedConfig()
  const hoursUntilFail = feedsConfig.hoursUntilFail
  if (!hoursUntilFail) {
    return false
  }
  const failRecord = await getFailRecord(url)
  if (!failRecord) {
    return false
  }
  const now = new Date()
  const failDate = new Date(failRecord.failedAt)
  failDate.setTime(failDate.getTime() + hoursUntilFail * 60 * 60 * 1000)
  return now > failDate
}

/**
 * @param {string} guildID
 */
async function getFeedsOfGuild (guildID) {
  const feeds = await Feed.getManyBy('guild', guildID)
  return feeds.map(f => f.toJSON())
}

/**
 * @param {import('../util/RequestHandler.js')} requestHandler
 * @param {import('discord.rss').Feed} feed
 */
async function getWebhook (requestHandler, feed) {
  const feedWebhook = feed.webhook
  return requestHandler.getWithBot(`/webhooks/${feedWebhook.id}`)
}

/**
 * @param {import('discord.rss').Feed} feed
 * @param {Object<string, any>} article
 * @param {string} [channel]
 */
async function createArticleMessage (feed, article, channel) {
  const created = await ArticleMessage.create(feed, article)
  if (channel) {
    created.feed.channel = channel
  }
  return created
}

/**
 * @param {import('../util/RequestHandler.js')} requestHandler
 * @param {import('discord.rss').ArticleMessage} articleMessage
 */
async function sendMessage (requestHandler, articleMessage) {
  const { text, options } = articleMessage.createTextAndOptions()
  let textArray = [text]
  if (options.split) {
    textArray = Discord.Util.splitMessage(text, options.split)
  }
  for (let i = 0; i < textArray.length; ++i) {
    const thisText = textArray[i]
    const thisOptions = {
      content: thisText,
      allowed_mentions: options.allowedMentions
    }
    // Only attach the embed to the last message
    if (i === textArray.length - 1 && options.embeds && options.embeds.length > 0) {
      thisOptions.embed = options.embeds[0]
    }
    await requestHandler.postWithBot(`/channels/${articleMessage.feed.channel}/messages`, thisOptions)
  }
}

/**
 *
 * @param {import('../util/RequestHandler.js')} requestHandler
 * @param {import('discord.rss').ArticleMessage} articleMessage
 */
async function sendWebhookMessage (requestHandler, articleMessage) {
  const { feed, parsedArticle } = articleMessage
  const feedWebhook = feed.webhook
  const { id, token } = await getWebhook(requestHandler, feed)
  const { text, options } = articleMessage.createTextAndOptions()
  let textArray = [text]
  if (options.split) {
    textArray = Discord.Util.splitMessage(text, options.split)
  }
  let webhookName = feedWebhook.name
  if (webhookName) {
    webhookName = parsedArticle.convertKeywords(webhookName).slice(0, 32)
  }
  let webhookAvatar = feedWebhook.avatar
  if (webhookAvatar) {
    webhookAvatar = parsedArticle.convertImgs(webhookAvatar)
  }
  for (let i = 0; i < textArray.length; ++i) {
    const thisText = textArray[i]
    const thisOptions = {
      username: webhookName,
      avatar_url: webhookAvatar,
      content: thisText,
      allowed_mentions: options.allowedMentions
    }
    // Only attach the embeds to the last message
    if (i === textArray.length - 1 && options.embeds && options.embeds.length > 0) {
      thisOptions.embeds = options.embeds
    }
    await requestHandler.postWithBot(`/webhooks/${id}/${token}?wait=true`, thisOptions)
  }
}

module.exports = {
  getAnonymousFeedPlaceholders,
  getFeedArticles,
  getFeedOfGuild,
  createFeed,
  editFeed,
  deleteFeed,
  getDatabaseArticles,
  getFailRecord,
  feedURLHasFailed,
  getFeedsOfGuild,
  createArticleMessage,
  getWebhook,
  sendMessage,
  sendWebhookMessage
}
