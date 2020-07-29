'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const widdershins = require('../widdershins')
const openApiSnippet = require('../openapiSnippet')
const shins = require('../shins')
const openapi2postman = require('../openapi2postman')
const REDOC_INDEX_TEMPLATE = '../../templates/redoc.html'
const ASYNCDOC_INDEX_TEMPLATE = '../../templates/asyncdoc.html'
const SLATE_FILEPATH = 'slate/index.html'
const REDOC_SPEC_FILEPATH = 'redoc/openapi.yaml'
const REDOC_INDEX_FILEPATH = 'redoc/index.html'
const ASYNCDOC_INDEX_FILEPATH = 'asyncdoc/index.html'
const ASYNCDOC_SPEC_FILEPATH = 'asyncdoc/asyncapi.yaml'

/**
 * Generates API Docs for a given spec
 * @module genDocs
 * @param {Object} spec A Validated Spec (OpenApi v3 or AsyncApi v2)
 * @returns {Promise<array>} Array of file objects in the form of {filePath, data}
 */
module.exports = spec =>
  // Generators call here, add to array and output as {filePath, data}
  Promise.all([
    // Markdown Slates
    widdershins(spec).then(shins),
    // Enriched Code Snippets for HTML Renderers (currently only openapi)
    ...(spec.openapi && [openApiSnippet(spec)]) || (spec.asyncapi && [spec]),
    // Convert and update POSTMAN collection (currently only openapi)
    ...(spec.openapi && [openapi2postman(spec)]) || [[]]
  ])
    // Output each file to be rendered as {filePath, data}
    .then(([shinsHTML, enrichedSpec]) => [
      // Slate
      {filePath: `${spec.info.title}/${SLATE_FILEPATH}`, data: shinsHTML},
      // If an openapi spec, output the enriched spec(code samples, etc)
      ...spec.openapi ? [{filePath: `${spec.info.title}/${REDOC_SPEC_FILEPATH}`, data: yaml.safeDump(enrichedSpec)}] : [],
      // If an openapi spec, output the REDOC Index file
      ...spec.openapi ? [{filePath: `${spec.info.title}/${REDOC_INDEX_FILEPATH}`, data: fs.readFileSync(path.join(__dirname, REDOC_INDEX_TEMPLATE), 'utf-8')}] : [],
      // If an asyncapi spec, output the enriched spec(code samples, etc)
      ...spec.asyncapi ? [{filePath: `${spec.info.title}/${ASYNCDOC_SPEC_FILEPATH}`, data: yaml.safeDump(enrichedSpec)}] : [],
      // If an asyncapi spec, output the ASYNCDOC Index file
      ...spec.asyncapi ? [{filePath: `${spec.info.title}/${ASYNCDOC_INDEX_FILEPATH}`, data: fs.readFileSync(path.join(__dirname, ASYNCDOC_INDEX_TEMPLATE), 'utf-8')}] : []
    ])
