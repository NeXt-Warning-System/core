const amqplib = require('amqplib')

async function createQueueChannel (url, queue) {
  const connection = await amqplib.connect(url)
  const channel = await connection.createChannel()

  await channel.assertQueue(queue, { durable: true })

  return channel
}

async function enqueue (url, queue, payload) {
  const channel = await createQueueChannel(url, queue)
  const result = channel.sendToQueue(queue, Buffer.from(payload), { persistent: true })
  channel.connection.close()

  return result
}

async function dequeue (url, queue, consumer) {
  const channel = await createQueueChannel(url, queue)
  channel.prefetch(1)
  const result = channel.consume(queue, msg => {
    const json = msg.content.toString()
    const payload = JSON.parse(json)
    consumer(payload)
    channel.ack(msg)
  })

  return result
}

module.exports = {
  enqueue,
  dequeue
}
