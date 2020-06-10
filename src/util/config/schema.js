const Joi = require('@hapi/joi')

const logSchema = Joi.object({
  level: Joi.string().strict().valid('silent', 'trace', 'debug', 'info', 'warn', 'error', 'fatal').default('info'),
  destination: Joi.string().allow('').default('')
})

const botSchema = Joi.object({
  token: Joi.string().strict().required(),
  redirectURI: Joi.string().disallow('').required(),
  clientID: Joi.string().disallow('').required(),
  clientSecret: Joi.string().disallow('').required()
})

const databaseSchema = Joi.object({
  uri: Joi.string().strict().default('mongodb://localhost:27017/rss'),
  redis: Joi.string().strict().allow('').default(''),
  connection: Joi.object().default({})
})

const httpsSchema = Joi.object({
  enabled: Joi.bool().strict().default(false),
  privateKey: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  certificate: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  chain: Joi.string().allow('').default('').when('enabled', {
    is: true,
    then: Joi.string().disallow('').required()
  }),
  port: Joi.number().strict().default(443)
})

const httpSchema = Joi.object({
  trustProxy: Joi.bool().strict().default(false),
  port: Joi.number().strict().default(8081),
  sessionSecret: Joi.string().disallow('').default('keyboard cat')
})

const schema = Joi.object({
  adminIDs: Joi.array().items(Joi.string().strict()).default([]),
  log: logSchema.default(logSchema.validate({}).value),
  bot: botSchema.default(botSchema.validate({}).value),
  database: databaseSchema.default(databaseSchema.validate({}).value),
  http: httpSchema.default(httpSchema.validate({}).value),
  https: httpsSchema.default(httpsSchema.validate({}).value),
  disableCP: Joi.string().strict().allow('')
})

module.exports = {
  defaults: schema.validate({}).value,
  validate: config => {
    const results = schema.validate(config, {
      abortEarly: false
    })
    if (results.error) {
      const str = results.error.details
        .map(d => d.message)
        .join('\n')

      throw new TypeError(`Web config validation failed\n\n${str}\n`)
    }
  }
}
