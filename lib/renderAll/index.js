'use strict'

const gcpBucket = require('../gcpBucket')
const parseSpec = require('../parseSpec')
const genDocs = require('../genDocs')
const genMain = require('../genMain')

gcpBucket.downloadBucket()
  .then(files => Promise.all(files.map(file => gcpBucket.downloadFile(file.name))))
  .then(filesData => Promise.all(filesData.map(parseSpec)))
  .then(parsedSpecs => Promise.all(parsedSpecs.map(genDocs)))
  .then(docs => docs.flat())
  .then(docs => Promise.all(docs.flat().map(gcpBucket.saveFile)))
  // Generate main page
  .then(() => genMain())
  .then(gcpBucket.saveFile)
