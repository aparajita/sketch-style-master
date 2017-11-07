'use strict'

const { execSync } = require('child_process')
const fs = require('fs-extra')
const utils = require('./utils')

const pathInfo = utils.getPathInfo()

// Remove existing zip
fs.remove(pathInfo.sourcePath + '.zip')
.then(() => {
  // Zip the plugin
  execSync(`zip -r '${pathInfo.pluginDir}.zip' '${pathInfo.pluginDir}' -x .DS_Store`, { encoding: 'utf8' })
})
.catch(e => {
  console.log(e)
})
