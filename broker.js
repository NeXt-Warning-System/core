const amqplib = require('amqplib')

async function connect (url) {
  const connection = await amqplib.connect(url)

  return connection
}

async function drainChannel (channel) {
  // https://stackoverflow.com/questions/45698976/node-js-amqplib-when-to-close-connection
  return new Promise(resolve => channel.once('drain', resolve))
}

function toBuffer (data) {
  const buffer = Buffer.from(JSON.stringify(data))

  return buffer
}

function fromBuffer (buffer) {
  const json = buffer.toString()
  const data = JSON.parse(json)

  return data
}

module.exports = {
  connect,
  drainChannel,
  fromBuffer,
  toBuffer
}
