'use strict'

const yaml = require('js-yaml')
const oasvalidator = require('oas-validator')
const AsyncApiValidator = require('asyncapi-validator')

/**
 * Parses and Validates an OpenApi v3 or AsyncApi v2 specification
 * @module parseSpec
 * @param {Object} spec OpenApi v3 or AsyncApi v2
 */
module.exports = async (data) => {
  const spec = yaml.safeLoad(data)
  if (spec.openapi) {
    await oasvalidator.validate(spec, {})
  } else if (spec.asyncapi) {
    await AsyncApiValidator.fromSource(spec)
  } else {
    return Promise.reject(new Error('No supported spec found - currently openapi v3 and asyncapi v2'))
  }
  return spec
}
