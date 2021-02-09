const joi = require('joi')

// Object schema helper function
function createSchema (keys) {
  const schema = joi.object().required()

  return keys ? schema.keys(keys) : schema
}

const EVENTS = {
  alert: {
    alert: {
      issued: 'alert.alert.issued'
    }
  },
  notification: {
    alert: {
      created: 'notification.alert.created',
      published: 'notification.alert.published'
    },
    message: {
      created: 'notification.message.created'
    }
  }
}

const eventsSchema = {
  'alert.alert.issued': createSchema(),
  'notification.alert.created': createSchema(),
  'notification.alert.published': createSchema(),
  'notification.message.created': createSchema()
}

// `flatten` changes leaf nodes of the events
// object from a `schema` to the dot-separated key `path`.
// It also returns the a map of key paths to schema.
// function flatten (obj) {
//   const dict = {}
//   const dot = '.'

//   function _flatten (obj, dict, keyPrefix) {
//     if (obj === null) {
//       return dict
//     }

//     for (const name in obj) {
//       if (Object.prototype.hasOwnProperty.call(obj, name)) {
//         let keyName

//         if (keyPrefix) {
//           keyName = keyPrefix + dot + name
//         } else {
//           keyName = name
//         }

//         if (joi.isSchema(obj[name])) {
//           dict[keyName] = obj[name]
//           obj[name] = keyName
//         } else if (typeof obj[name] === 'object') {
//           // Continue recursing
//           _flatten(obj[name], dict, keyName)
//         } else {
//           dict[keyName] = obj[name]
//         }
//       }
//     }

//     return dict
//   }

//   return _flatten(obj, dict, null)
// }

// const eventSchema = flatten(events)

module.exports = {
  EVENTS,
  eventsSchema
}
