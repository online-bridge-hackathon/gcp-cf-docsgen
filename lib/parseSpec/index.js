'use strict'

const yaml = require('js-yaml')
const oasvalidator = require('oas-validator')
const AsyncApiValidator = require('asyncapi-validator')

/**
 * Parses and Validates an OpenApi v3 or AsyncApi v2 specification
 * @module parseSpec
 * @param {Object} spec OpenApi v3 or AsyncApi v2
 * @returns {Promise<Object>} A validated spec
 */
module.exports = data => Promise.resolve(yaml.safeLoad(data))
  .then(spec =>
    (spec && ((spec.openapi && oasvalidator.validate(spec, {}).then(() => spec)) ||
      (spec.asyncapi && AsyncApiValidator.fromSource(spec).then(() => spec)))) ||
        Promise.reject(new Error('No supported spec found - currently openapi v3 and asyncapi v2')))
