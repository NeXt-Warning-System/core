const { toBuffer, connect } = require('./broker')

async function createChannel (connection, queue) {
  const channel = await connection.createChannel()
  await channel.assertQueue(queue, { durable: true })

  return channel
}

/**
 * Helper to enqueue a message to a queue.
 * Useful when you don't want to manage the channel or connection.
 * (Not currently used - maybe not useful?)
 * @param {string} url - The broker url
 * @param {string} topic - The topic
 * @param {object} data - The data
 */
async function enqueue (url, queue, data) {
  const connection = await connect(url)
  const channel = await createChannel(connection, queue)
  const content = toBuffer(data)
  const sendResult = channel.sendToQueue(queue, content, { persistent: true })

  await channel.close()
  await connection.close()

  return sendResult
}

async function dequeue (channel, queue, consumer) {
  channel.prefetch(1)

  const result = channel.consume(queue, event => {
    const json = event.content.toString()
    const data = JSON.parse(json)
    consumer(data)
    channel.ack(event)
  })

  return result
}

module.exports = {
  enqueue,
  dequeue,
  createChannel
}
