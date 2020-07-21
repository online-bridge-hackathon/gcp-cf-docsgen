'use strict'

const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const shins = require('shins')
const { downloadFile, downloadBucket } = require('../gcpBucket')
const parseSpec = require('../parseSpec')
const HOME_TEMPLATE = '../../templates/readme.html.md.mustache'
const HOME_FILEPATH = 'index.html'

/**
 *
 */
module.exports = () => downloadBucket()
  .then(files => Promise.all(files.map(file => downloadFile(file.name))))
  .then(filesData => Promise.all(filesData.map(parseSpec)))
  .then(specs => specs.map(spec => ({
    title: {
      plain: spec.info.title,
      smallcase: spec.info.title.toLowerCase()
    },
    ...spec.openapi ? {openapi: true} : {},
    ...spec.asyncapi ? {asyncapi: true} : {}
  })))
  .then(homeView => ({
    fileName: `${HOME_FILEPATH}`,
    data: shins(mustache.render(fs.readFileSync(path.join(__dirname, HOME_TEMPLATE), 'utf-8'), homeView))
  }))

// const files = await downloadBucket()
// const specs = await Promise.all(files.map(file => downloadFile(file.name))).then(filesData => filesData.map(parseSpec))
// const homeView = specs.map(spec => ({
//   title: {
//     plain: spec.info.title,
//     smallcase: spec.info.title.toLowerCase()
//   },
//   ...spec.openapi ? {openapi: true} : {},
//   ...spec.asyncapi ? {asyncapi: true} : {}
// }))
// return {fileName: `${HOME_FILEPATH}`, data: shins(mustache.render(fs.readFileSync(path.join(__dirname, HOME_TEMPLATE), 'utf-8'), homeView))}
