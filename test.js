const listen = require('pg-listen')
const connectionString = process.env.PUBSUB_URL

// Accepts the same connection config object that the "pg" package would take
const subscriber = listen({ connectionString })

subscriber.notifications.on('alert.publish', payload => {
  // Payload as passed to subscriber.notify() (see below)
  console.log('Received notification in "alert.publish:', payload)
})

subscriber.events.on('error', error => {
  console.error('Fatal database connection error:', error)
  process.exit(1)
})

process.on('exit', () => {
  subscriber.close()
})

async function connect () {
  await subscriber.connect()
  await subscriber.listenTo('alert.publish')
}

// async function sendSampleMessage () {
//   await subscriber.notify('alert', {
//     greeting: 'Hey, buddy.',
//     timestamp: Date.now()
//   })
// }

connect()
//   .then(() => {
//     sendSampleMessage()
//   })
