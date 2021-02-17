const joi = require('joi')

// Object schema helper function
function createSchema (keys) {
  const schema = joi.object().required()

  return keys ? schema.keys(keys) : schema
}

const ALERT_ALERT_ISSUED = 'alert.alert.issued'
const NOTIFICATION_ALERT_CREATED = 'notification.alert.created'
const NOTIFICATION_ALERT_PUBLISHED = 'notification.alert.published'
const NOTIFICATION_MESSAGE_CREATED = 'notification.message.created'

const EVENTS = {
  alert: {
    alert: {
      issued: ALERT_ALERT_ISSUED
    }
  },
  notification: {
    alert: {
      created: NOTIFICATION_ALERT_CREATED,
      published: NOTIFICATION_ALERT_PUBLISHED
    },
    message: {
      created: NOTIFICATION_MESSAGE_CREATED
    }
  }
}

const eventsSchema = {
  [ALERT_ALERT_ISSUED]: createSchema(),
  [NOTIFICATION_ALERT_CREATED]: createSchema(),
  [NOTIFICATION_ALERT_PUBLISHED]: createSchema(),
  [NOTIFICATION_MESSAGE_CREATED]: createSchema()
}

module.exports = {
  EVENTS,
  eventsSchema,
  ALERT_ALERT_ISSUED,
  NOTIFICATION_ALERT_CREATED,
  NOTIFICATION_ALERT_PUBLISHED,
  NOTIFICATION_MESSAGE_CREATED
}
