const { toBuffer, connect } = require('./broker')
const validateEventData = require('./validate-event-data')

/**
 * Helper to create a Queue channel
 *
 * @param {object} connection - The broker connection
 * @param {string} queue - The queue name
 */
async function createChannel (connection, queue) {
  const channel = await connection.createChannel()

  await channel.assertQueue(queue, { durable: true })

  return channel
}

/**
 * Helper to enqueue a message to a queue.
 * Useful when you don't want to manage the channel or connection.
 * (Not currently used - maybe not useful?)
 *
 * @param {string} url - The broker url
 * @param {string} queue - The queue
 * @param {object} data - The data
 */
async function enqueue (url, queue, data) {
  validateEventData(queue, data)

  const connection = await connect(url)
  const channel = await createChannel(connection, queue)
  const content = toBuffer(data)
  const sendResult = channel.sendToQueue(queue, content, { persistent: true })

  await channel.close()
  await connection.close()

  return sendResult
}

/**
 * Helper to dequeue a message from a queue.
 *
 * @param {object} channel - The broker channel
 * @param {string} queue - The queue name
 * @param {function} consumer - The consumer callback function
 */
async function dequeue (channel, queue, consumer) {
  channel.prefetch(1)

  const result = channel.consume(queue, event => {
    const json = event.content.toString()
    const data = JSON.parse(json)

    validateEventData(queue, data)
    consumer(data)

    // Todo: probably should await the consumer call before acking
    // but can we make the assumption the consumer is async?
    channel.ack(event)
  })

  return result
}

module.exports = {
  enqueue,
  dequeue,
  createChannel
}
