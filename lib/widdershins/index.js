'use strict'

const converter = require('widdershins')
const options = {
  codeSamples: true,
  httpsnippet: false,
  templateCallback: function (templateName, stage, data) { return data },
  theme: 'darkula',
  search: true,
  sample: true,
  discovery: false,
  includes: [],
  shallowSchemas: false,
  tocSummary: false,
  headings: 2,
  yaml: false
}

/**
 * Converts an API spec (OpenApi or AsyncApi) to Markdown
 * @module widdershins
 * @param {Object} spec A Validated Spec (OpenApi v3 or AsyncApi v2)
 * @returns {Promise<string>} Markdown convertion for a given spec
 */
module.exports = spec => converter.convert(spec, options)
