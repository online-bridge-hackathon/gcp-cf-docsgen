'use strict'

const {Storage} = require('@google-cloud/storage')
const API_BUCKET = process.env.API_BUCKET || 'gba-apis'
const DOCS_BUCKET = process.env.DOCS_BUCKET || 'gba-docs'

/**
 * Saves/Uploads file to DOCS GCP Bucket - GCP Node SDK
 * @param {Object} fileObject
 * @param {string} fileObject.filePath
 * @param {string} fileObject.data
 */
exports.saveFile = ({filePath, data}) => {
  const storage = new Storage()
  const docsBucket = storage.bucket(DOCS_BUCKET)
  const file = docsBucket.file(filePath)
  return file.save(data)
}

/**
 * Downloads a file from API GCP Bucket - GCP Node SDK
 * @param {string} filePath
 * @returns {Promise<string>} File content
 */
exports.downloadFile = filePath => {
  const storage = new Storage()
  const apiBucket = storage.bucket(API_BUCKET)
  const file = apiBucket.file(filePath)
  return file.download().then(data => data[0])
}

/**
 * Downloads a file link object from API GCP Bucket - GCP Node SDK
 * @returns {Promise<array>} GCP Bucket file-link-object array
 */
exports.downloadBucket = () => {
  const storage = new Storage()
  const apiBucket = storage.bucket(API_BUCKET)
  return apiBucket.getFiles().then(data => data[0])
}
