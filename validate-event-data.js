const { eventsSchema } = require('./events')

function validateEventData (channelName, data) {
  const schema = eventsSchema[channelName]

  // Validate event data
  if (schema) {
    const { error, value } = schema.validate(data)

    // Throw if data is invalid
    if (error) {
      const message = error.message
      throw new Error(`The event data for '${channelName}' is invalid. ${message}`)
    }

    // Update the data
    data = value
  }

  return data
}

module.exports = validateEventData
