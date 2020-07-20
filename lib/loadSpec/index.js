'use strict'

const yaml = require('js-yaml')
const {Storage} = require('@google-cloud/storage')
const API_BUCKET = process.env.api_bucket || 'gba-apis'

/**
 * Loads and parses an OpenApi or AsyncApi from a GCP bucket
 *
 * @method
 * @param {string} filePath gcp's filepath
 */
module.exports = async (filePath) => {
  // Fetch spec, GCP SDK
  const storage = new Storage()
  const apiBucket = storage.bucket(API_BUCKET)
  const file = apiBucket.file(filePath)
  const download = await file.download()
  const spec = yaml.safeLoad(download[0])
  return spec
}
