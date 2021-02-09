const joi = require('joi')

// Object schema helper function
function createSchema (keys) {
  return joi.object().keys(keys).required()
}

const events = {
  alert: {
    alert: {
      issued: createSchema({
        alert: joi.string().required()
      })
    }
  },
  notification: {
    alert: {
      created: createSchema({}),
      published: createSchema({})
    },
    message: {
      created: createSchema({})
    }
  }
}

// `flatten` changes leaf nodes of the events
// object from a `schema` to the dot-separated key `path`.
// It also returns the a map of key paths to schema.
function flatten (obj) {
  const dict = {}
  const dot = '.'

  function _flatten (obj, dict, keyPrefix) {
    if (obj === null) {
      return dict
    }

    for (const name in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, name)) {
        let keyName

        if (keyPrefix) {
          keyName = keyPrefix + dot + name
        } else {
          keyName = name
        }

        if (joi.isSchema(obj[name])) {
          dict[keyName] = obj[name]
          obj[name] = keyName
        } else if (typeof obj[name] === 'object') {
          // Continue recursing
          _flatten(obj[name], dict, keyName)
        } else {
          dict[keyName] = obj[name]
        }
      }
    }

    return dict
  }

  return _flatten(obj, dict, null)
}

const eventSchema = flatten(events)

module.exports = {
  EVENTS: events,
  eventSchema: eventSchema
}
