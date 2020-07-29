'use strict'

const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const shins = require('../shins')
const gcpBucket = require('../gcpBucket')
const parseSpec = require('../parseSpec')
const HOME_TEMPLATE = '../../templates/readme.html.md.mustache'
const HOME_FILEPATH = 'index.html'

/**
 * Generates the main page
 * @module genMain
 * @returns {Promise<Object>} File object in the form of {filePath, data}
 */
module.exports = () => gcpBucket.downloadBucket()
  .then(files => Promise.all(files.map(file => gcpBucket.downloadFile(file.name))))
  .then(filesData => Promise.all(filesData.map(parseSpec)))
  .then(homeView => shins(mustache.render(fs.readFileSync(path.join(__dirname, HOME_TEMPLATE), 'utf-8'), {homeView})))
  .then(data => ({
    filePath: `${HOME_FILEPATH}`,
    data
  }))
