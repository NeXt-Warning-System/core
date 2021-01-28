const client = require('amqplib')

async function pubsub (amqpUri, topic) {
  const connection = await client.connect(amqpUri)
  const channel = await connection.createChannel()
  await channel.assertExchange(topic, 'fanout', { durable: false })

  return channel
}

async function publish (amqpUri, topic, payload) {
  const channel = pubsub(amqpUri, topic)

  const publishResult = channel.publish(topic, '', Buffer.from(JSON.stringify(payload)))

  return publishResult
}

module.exports = { client, publish }
