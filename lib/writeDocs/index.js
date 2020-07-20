'use strict'

const {Storage} = require('@google-cloud/storage')
const DOCS_BUCKET = process.env.docs_bucket || 'gba-docs'

/**
 * Uploads the contents of a docsOutput Object to gcp's bucket
 *
 * @method
 * @param {Object} docsOutput
 * @param {Object} docsOutput.fileName Output filename
 * @param {Object} docsOutput.data Output data
 */
module.exports = docsOutput => {
  // Upload spec, GCP SDK
  const storage = new Storage()
  const docsBucket = storage.bucket(DOCS_BUCKET)
  return Promise.all(docsOutput.map(({fileName, data}) => {
    const file = docsBucket.file(fileName)
    return file.save(data)
  }))
}
