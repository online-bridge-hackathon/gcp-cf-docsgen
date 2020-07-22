'use strict'

const OpenAPISnippet = require('openapi-snippet')
const TARGETS = ['node_request', 'shell_curl', 'shell_httpie', 'python_python3', 'c_libcurl', 'java_unirest', 'javascript_xhr']

/**
 * Enriches an OpenApi spec with code snippets
 * @module openapi2Snippet
 * @param {Object} openApi An OpenApi v3 spec.
 * @returns {Object} An OpenApi enriched spec
 */
module.exports = openApi => {
  for (const path in openApi.paths) {
    for (const method in openApi.paths[path]) {
      const generatedCode = OpenAPISnippet.getEndpointSnippets(openApi, path, method, TARGETS)
      openApi.paths[path][method]['x-code-samples'] = []
      for (const snippetIdx in generatedCode.snippets) {
        const snippet = generatedCode.snippets[snippetIdx]
        openApi.paths[path][method]['x-code-samples'][snippetIdx] = { 'lang': snippet.title, 'source': snippet.content }
      }
    }
  }
  return openApi
}
