'use strict'

const gcpBucket = require('./lib/gcpBucket')
const parseSpec = require('./lib/parseSpec')
const genDocs = require('./lib/genDocs')
const genMain = require('./lib/genMain')

/**
 * GCP Cloud Function call method. 
 * Generates both the API documentation for a given spec (OpenApi-v3 or AsyncApi-v2) and the main page.
 *
 * @module init
 * @param {*} file
 * @param {*} context
 * @param {*} callback
 */
exports.init = (file, context, callback) => Promise.resolve(file.name)
  .then(gcpBucket.downloadFile)
  .then(parseSpec)
  // Generate docs for uploaded spec
  .then(genDocs)
  .then(docs => docs.map(gcpBucket.saveFile))
  // Generate main page
  .then(() => genMain())
  .then(gcpBucket.saveFile)
  .then(() => callback())
