'use strict'

const axios = require('axios')
const convert = require('util').promisify(require('openapi-to-postmanv2').convert)
const XAPIKEY = process.env.POSTMAN_APIKEY || ''
const postmanRequest = (projectUid, collection) => axios.put(
  `https://api.getpostman.com/collections/${projectUid}?format=2.1.0`,
  collection,
  {headers: {
    'X-Api-Key': XAPIKEY,
    'Content-Type': 'application/json'
  }})

/**
 * Converts an OpenApi Spec to a Postman v2 collection and updates/syncs within globalbridge-app team space
 * @module openapi2postman
 * @param {Object} spec
 */
module.exports = spec => convert({ type: 'string', data: JSON.stringify(spec) }, {})
  .then(({result, output, reason}) =>
    ({
      ...output[0].data,
      info:
        {
          ...output[0].data.info,
          id: spec.info['x-postman'].id,
          _postman_id: spec.info['x-postman'].id
        }
    }))
  .then(collection => postmanRequest(spec.info['x-postman'].uid, {collection}))
  .then(() => console.info('Sucessfully updated POSTMAN collection'))
