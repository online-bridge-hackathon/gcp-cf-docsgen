'use strict'

const path = require('path')
const shins = require('util').promisify(require('shins').render)
const LOGO_PATH = path.join(__dirname, '../../templates/logo.png')
const shinsOptions = {
  cli: false,
  minify: true,
  customCss: false,
  inline: true,
  unsafe: false,
  logo: LOGO_PATH
}

/**
 * Converts a markdown string to slate format using shins
 * @module shins
 * @param {string} markdownString
 * @returns {Promise<string>} HTML Shins page
 */
module.exports = markdownString => shins(markdownString, shinsOptions)
