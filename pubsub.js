const amqplib = require('amqplib')

async function createPubsubChannel (url, topic) {
  const connection = await amqplib.connect(url)
  const channel = await connection.createChannel()
  await channel.assertExchange(topic, 'fanout', { durable: false })

  return channel
}

async function publish (url, topic, payload) {
  const channel = await createPubsubChannel(url, topic)
  const publishResult = channel.publish(topic, '', Buffer.from(JSON.stringify(payload)))

  return publishResult
}

async function subscribe (url, topic, consumer) {
  const channel = await createPubsubChannel(url, topic)
  const assertQueue = await channel.assertQueue('', { exclusive: true })
  await channel.bindQueue(assertQueue.queue, topic, '')

  return channel.consume(assertQueue.queue, msg => {
    const json = msg.content.toString()
    const payload = JSON.parse(json)
    consumer(payload)
  }, {
    noAck: true
  })
}

module.exports = {
  publish,
  subscribe
}
