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
 * Generators call for openapi here, add to array and output as {filePath, data}
 * @param {Object} spec A Validated Spec (OpenApi v3 or AsyncApi v2)
 * @returns {Array} Array of file objects in the form of {filePath, data} to be executed
 */
const openapiGenArray = spec => [

  // Markdown Slates
  widdershins(spec)
    .then(shins)
    .then(shinsHTML =>
      ({
        filePath: `${spec.info.title}/${SLATE_FILEPATH}`,
        data: shinsHTML
      }))
    .catch(console.error),

  // Enriched Code Snippets for HTML Renderers
  Promise.resolve(openApiSnippet(spec))
    .then(enrichedSpec =>
      ({
        filePath: `${spec.info.title}/${REDOC_SPEC_FILEPATH}`,
        data: yaml.safeDump(enrichedSpec)
      }))
    .catch(console.error),

  // Redoc HTML
  {
    filePath: `${spec.info.title}/${REDOC_INDEX_FILEPATH}`,
    data: fs.readFileSync(path.join(__dirname, REDOC_INDEX_TEMPLATE), 'utf-8')
  },

  // Update Postman Collection
  openapi2postman(spec)
    .then(() => [])
    .catch(console.error)
]

/**
 * Generators call for asyncapi here, add to array and output as {filePath, data}
 * @param {Object} spec A Validated Spec (OpenApi v3 or AsyncApi v2)
 * @returns {Array} Array of file objects in the form of {filePath, data} to be executed
 */
const asyncapiDocGenArray = spec => [

  // Markdown Slates
  widdershins(spec)
    .then(shins)
    .then(shinsHTML =>
      ({
        filePath: `${spec.info.title}/${SLATE_FILEPATH}`,
        data: shinsHTML
      }))
    .catch(console.error),

  // Enriched spec for HTML Renderers (plain for now)
  {
    filePath: `${spec.info.title}/${ASYNCDOC_SPEC_FILEPATH}`,
    data: yaml.safeDump(spec)
  },

  // ASYNCDOCs
  {
    filePath: `${spec.info.title}/${ASYNCDOC_INDEX_FILEPATH}`,
    data: fs.readFileSync(path.join(__dirname, ASYNCDOC_INDEX_TEMPLATE), 'utf-8')
  }
]

/**
 * Generates API Docs for a given spec
 * @module genDocs
 * @param {Object} spec A Validated Spec (OpenApi v3 or AsyncApi v2)
 * @returns {Promise<array>} Array of file objects in the form of {filePath, data}
 */
module.exports = spec =>
  (spec.openapi && Promise.all(openapiGenArray(spec))) ||
  (spec.asyncapi && Promise.all(asyncapiDocGenArray(spec)))
