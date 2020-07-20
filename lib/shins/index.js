'use strict'

const path = require('path')
const shins = require('util').promisify(require('shins').render)
const LOGO_PATH = path.join(__dirname, '../../templates/logo.png')
const shinsOptions = {
  cli: false, // if true, missing files will trigger an exit(1)
  minify: true,
  customCss: false,
  inline: true,
  unsafe: false, // setting to true turns off markdown sanitisation
  logo: LOGO_PATH
  // options['logo-url'] : 'https://www.example.com'
}

/**
 * Converts a markdown string to slate format using shins
 *
 * @method
 * @param {string} markdownString
 */
module.exports = markdownString => shins(markdownString, shinsOptions)
