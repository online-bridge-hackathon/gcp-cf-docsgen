'use strict'

const converter = require('widdershins')
const options = {
  codeSamples: true,
  httpsnippet: false,
  templateCallback: function (templateName, stage, data) { return data },
  theme: 'darkula',
  search: true,
  sample: true, // set false by --raw
  discovery: false,
  includes: [],
  shallowSchemas: false,
  tocSummary: false,
  headings: 2,
  yaml: false
  // options.language_tabs        : [];
  // options.language_clients     : [];
  // options.loadedFrom           : sourceUrl; // only needed if input document is relative
  // options.user_templates       : './user_templates';
  // options.resolve              : false;
  // options.source               : sourceUrl; // if resolve is true, must be set to full path or URL of the input document
}

/**
 * Converts an API spec (OpenApi or AsyncApi) to Markdown
 *
 * @method
 * @param {Object} spec A Validated Spec (OpenApi v3 or AsyncApi v2)
 */
module.exports = spec => converter.convert(spec, options)
