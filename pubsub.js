const listen = require('pg-listen')

function pubsub (connectionString) {
  const listener = listen({ connectionString })

  return listener
}

async function publish (connectionString, channel, payload) {
  const listener = pubsub(connectionString)

  await listener.connect()

  const publishResult = await listener.notify(channel, payload)

  listener.close()

  return publishResult
}

module.exports = { pubsub, publish }
