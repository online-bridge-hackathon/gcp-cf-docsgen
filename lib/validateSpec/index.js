'use strict'

const oasvalidator = require('oas-validator')
const AsyncApiValidator = require('asyncapi-validator')

/**
 * Validates and returns an OpenApi v3 or AsyncApi v2 specification
 *
 * @method
 * @param {Object} spec OpenApi v3 or AsyncApi v2
 */
module.exports = async (spec) => {
  if (spec.openapi) {
    await oasvalidator.validate(spec, {})
  } else if (spec.asyncapi) {
    await AsyncApiValidator.fromSource(spec)
  } else {
    return Promise.reject(new Error('No spec found.'))
  }
  return spec
}
