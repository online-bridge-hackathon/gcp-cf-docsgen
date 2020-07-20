'use strict'

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const mustache = require('mustache')
const widdershins = require('../widdershins')
const openApiSnippet = require('../openapiSnippet')
const shins = require('../shins')
const getProjectName = spec => spec.title
const getHomeView = spec => ({
  title: {
    plain: spec.title,
    smallcase: spec.title.toLowerCase()
  },
  ...spec.openapi ? {openapi: true} : {},
  ...spec.asyncapi ? {asyncapi: true} : {}
})
const REDOC_INDEX_TEMPLATE = '../../templates/redoc.html'
const ASYNCDOC_INDEX_TEMPLATE = '../../templates/asyncdoc.html'
const HOME_TEMPLATE = '../../templates/readme.html.md.mustache'
const SLATE_FILEPATH = 'slate/index.html'
const REDOC_SPEC_FILEPATH = 'redoc/openapi.yaml'
const REDOC_INDEX_FILEPATH = 'redoc/index.html'
const ASYNCDOC_INDEX_FILEPATH = 'asyncdoc/index.html'
const ASYNCDOC_SPEC_FILEPATH = 'asyncdoc/asyncapi.yaml'
const HOME_FILEPATH = 'index.html'

/**
 * Generates API Docs for a given SPEC. Also renders the Main Home page every time.
 *
 * @method
 * @param {Object} spec A Validated Spec (OpenApi v3 or AsyncApi v2)
 */
module.exports = (spec, projectName = getProjectName(spec.title)) =>
  // Generators call here
  Promise.all(
    [
      // Main Home (Rendered every time)
      mustache.render(fs.readFileSync(path.join(__dirname, HOME_TEMPLATE), 'utf-8'), getHomeView(spec)),
      // Markdown Slates
      widdershins(spec).then(shins),
      // Enriched OpenApi Code Snippets for HTML Renderers
      ...spec.openapi ? [openApiSnippet(spec)] : [],
      // Enriched AsyncApi Code Snippets for HTML Renderers
      ...spec.asyncapi ? [spec] : []
    ])
  // Output each file to be rendered as {fileName, data}
    .then(([homeHTML, shinsHTML, enrichedOpenApiSpec, enrichedAsyncApiSpec]) => [
      // Home Index
      {fileName: `${projectName}/${HOME_FILEPATH}`, data: homeHTML},
      // Slate
      {fileName: `${spec.title}/${SLATE_FILEPATH}`, data: shinsHTML},
      // If an openapi spec, output the enriched spec(code samples, etc)
      ...spec.openapi ? {fileName: `${projectName}/${REDOC_SPEC_FILEPATH}`, data: yaml.safeDump(enrichedOpenApiSpec)} : {},
      // If an openapi spec, output the REDOC Index file
      ...spec.openapi ? {fileName: `${projectName}/${REDOC_INDEX_FILEPATH}`, data: fs.readFileSync(path.join(__dirname, REDOC_INDEX_TEMPLATE), 'utf-8')} : {},
      // If an asyncapi spec, output the enriched spec(code samples, etc)
      ...spec.asyncapi ? {fileName: `${projectName}/${ASYNCDOC_SPEC_FILEPATH}`, data: yaml.safeDump(enrichedAsyncApiSpec)} : {},
      // If an asyncapi spec, output the ASYNCDOC Index file
      ...spec.asyncapi ? {fileName: `${projectName}/${ASYNCDOC_INDEX_FILEPATH}`, data: fs.readFileSync(path.join(__dirname, ASYNCDOC_INDEX_TEMPLATE), 'utf-8')} : {}
    ])
