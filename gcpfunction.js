'use strict'

const loadSpec = require('./lib/loadSpec')
const validateSpec = require('./lib/validateSpec')
const writeDocs = require('./lib/writeDocs')
const genDocs = require('./lib/genDocs')

/**
 * GCP Cloud Function call method. Generates API documentation for a given spec (OpenApi-v3 or AsyncApi-v2)
 *
 * @method
 * @param {*} file
 * @param {*} context
 * @param {*} callback
 */
exports.init = (file, context, callback) => Promise.resolve(file.name)
  .then(loadSpec)
  .then(validateSpec)
  .then(genDocs)
  .then(writeDocs)
  .catch(console.log)
  .finally(() => callback())
