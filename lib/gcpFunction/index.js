'use strict'

const gcpBucket = require('../gcpBucket')
const parseSpec = require('../parseSpec')
const genDocs = require('../genDocs')
const genMain = require('../genMain')

/**
 * GCP Cloud Function onUpload.
 * Generates both the API documentation for a given spec (OpenApi-v3 or AsyncApi-v2) and the main page.
 *
 * @module onUpload
 * @param {Object} file [File object]{@ https://googleapis.dev/nodejs/storage/latest/Bucket.html#file} from GCP
 * @param {Object} context
 * @param {Function} callback Callback signal to GCP
 */
exports.onUpload = (file, context, callback) => Promise.resolve(file.name)
  .then(gcpBucket.downloadFile)
  .then(parseSpec)
  // Generate docs for uploaded spec
  .then(genDocs)
  .then(docs => docs.flat().map(gcpBucket.saveFile))
  // Generate main page
  .then(() => genMain())
  .then(gcpBucket.saveFile)
  .then(() => callback())

/**
 * GCP Cloud Function onDelete.
 * Updates the main page.
 * @module onDelete
 * @param {Object} file [File object]{@ https://googleapis.dev/nodejs/storage/latest/Bucket.html#file}
 * @param {Object} context
 * @param {Function} callback Callback signal to GCP
 */
exports.onDelete = (file, context, callback) => Promise.resolve(file.name)
  .then(console.info)
  // Generate main page
  .then(() => genMain())
  .then(gcpBucket.saveFile)
  .then(() => callback())
