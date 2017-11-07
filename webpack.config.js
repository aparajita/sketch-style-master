'use strict'

const helpers = require('./webpack-lib/config-helpers')

const pluginConfig = helpers.getPluginConfig()

// Customize pluginConfig and webpack config options here
const options = {
  nib: true
}
// End customize pluginConfig and webpack config

const config = helpers.makeConfig(pluginConfig, options)

// Customize webpack config here

// End customize webpack config

module.exports = config
