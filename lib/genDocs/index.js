'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const widdershins = require('../widdershins')
const openApiSnippet = require('../openapiSnippet')
const shins = require('../shins')

const REDOC_INDEX_TEMPLATE = '../../templates/redoc.html'
const ASYNCDOC_INDEX_TEMPLATE = '../../templates/asyncdoc.html'
const SLATE_FILEPATH = 'slate/index.html'
const REDOC_SPEC_FILEPATH = 'redoc/openapi.yaml'
const REDOC_INDEX_FILEPATH = 'redoc/index.html'
const ASYNCDOC_INDEX_FILEPATH = 'asyncdoc/index.html'
const ASYNCDOC_SPEC_FILEPATH = 'asyncdoc/asyncapi.yaml'

/**
 * Generates API Docs for a given SPEC. Also renders the Main Home page every time.
 * @module genDocs
 * @param {Object} spec A Validated Spec (OpenApi v3 or AsyncApi v2)
 */
module.exports = spec =>
  // Generators call here, add to array and output as {fileName, data}
  Promise.all([
    // Markdown Slates
    widdershins(spec).then(shins),
    // Enriched OpenApi Code Snippets for HTML Renderers
    ...spec.openapi ? [openApiSnippet(spec)] : [],
    // Enriched AsyncApi Code Snippets for HTML Renderers
    ...spec.asyncapi ? [spec] : []
  ])
    // Output each file to be rendered as {fileName, data}
    .then(([shinsHTML, enrichedOpenApiSpec, enrichedAsyncApiSpec]) => [
      // Slate
      {fileName: `${spec.info.title}/${SLATE_FILEPATH}`, data: shinsHTML},
      // If an openapi spec, output the enriched spec(code samples, etc)
      ...spec.openapi ? [{fileName: `${spec.info.title}/${REDOC_SPEC_FILEPATH}`, data: yaml.safeDump(enrichedOpenApiSpec)}] : [],
      // If an openapi spec, output the REDOC Index file
      ...spec.openapi ? [{fileName: `${spec.info.title}/${REDOC_INDEX_FILEPATH}`, data: fs.readFileSync(path.join(__dirname, REDOC_INDEX_TEMPLATE), 'utf-8')}] : [],
      // If an asyncapi spec, output the enriched spec(code samples, etc)
      ...spec.asyncapi ? [{fileName: `${spec.info.title}/${ASYNCDOC_SPEC_FILEPATH}`, data: yaml.safeDump(enrichedAsyncApiSpec)}] : [],
      // If an asyncapi spec, output the ASYNCDOC Index file
      ...spec.asyncapi ? [{fileName: `${spec.info.title}/${ASYNCDOC_INDEX_FILEPATH}`, data: fs.readFileSync(path.join(__dirname, ASYNCDOC_INDEX_TEMPLATE), 'utf-8')}] : []
    ])
