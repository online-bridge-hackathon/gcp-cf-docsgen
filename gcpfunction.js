'use strict'

const {saveFile, downloadFile} = require('./lib/gcpBucket')
const parseSpec = require('./lib/parseSpec')
const genDocs = require('./lib/genDocs')
const genMain = require('./lib/genMain')

/**
 * GCP Cloud Function call method. Generates both the API documentation for a given spec (OpenApi-v3 or AsyncApi-v2) and the main page.
 *
 * @module init
 * @param {*} file
 * @param {*} context
 * @param {*} callback
 */
exports.init = (file, context, callback) => Promise.all(
  [
    // Generate docs for uploaded spec
    Promise.resolve(file.name)
      .then(downloadFile)
      .then(parseSpec)
      .then(genDocs),
    // Generate main page
    genMain()
  ])
  // Save/Create spec with main page
  .then(resolved => Promise.all(resolved.flat().map(saveFile)))
  .catch(console.log)
  .finally(() => callback())
