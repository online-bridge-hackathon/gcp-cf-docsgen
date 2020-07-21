'use strict'

const convert = require('util').promisify(require('openapi-to-postmanv2').convert)

/**
 * Converts an OpenApi Spec to a Postman v2 collection
 * @module openapi2postman
 * @param {Object} spec
 */
module.exports = spec => convert({ type: 'json', data: spec })
  .then(({result, output, reason}) => (result && output[0].data) || Promise.reject(reason))
