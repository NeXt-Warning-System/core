const { eventSchema } = require('./events')
const { fromBuffer, toBuffer, connect } = require('./broker')

function validateEventData (topic, data) {
  const schema = schema[topic]

  // Validate event data
  if (schema) {
    const { error, value } = schema.validate(data)

    // Throw if data is invalid
    if (error) {
      const message = error.message
      throw new Error(`The event data for topic ${topic} is invalid. ${message}`)
    }

    // Update the data
    data = value
  }

  return data
}

async function createChannel (connection, topic) {
  const channel = await connection.createChannel()

  await channel.assertExchange(topic, 'fanout', { durable: false })

  return channel
}

/**
 * Helper to publish a message to an pubsub topic.
 * Useful when you don't want to manage the channel or connection.
 *
 * @param {string} url - The broker url
 * @param {string} topic - The topic
 * @param {object} data - The data
 */
async function publish (url, topic, data) {
  validateEventData(topic, data)

  const connection = await connect(url)
  const channel = await createChannel(connection, topic)
  const content = toBuffer(data)
  const publishResult = channel.publish(topic, '', content)

  await channel.close()
  await connection.close()

  return publishResult
}

/**
 *
 * @param {ChannelModel} channel
 * @param {string} topic
 * @param {function} consumer
 */
async function subscribe (channel, topic, consumer) {
  const assertQueue = await channel.assertQueue('', { exclusive: true })
  await channel.bindQueue(assertQueue.queue, topic, '')

  return channel.consume(assertQueue.queue, event => {
    const data = fromBuffer(event.content)
    validateEventData(topic, data)
    consumer(data)
  }, {
    noAck: true
  })
}

module.exports = {
  publish,
  subscribe,
  createChannel
}
