const chalk = require('chalk')
const fs = require('fs-extra')
const { enableSketchPluginHotloading } = require('./enable-sketch-plugin-hotloading')
const utils = require('./utils')

function installPlugin() {
  const pathInfo = utils.getPathInfo()

  try {
    // Delete an existing plugin or symlink if it exists
    fs.removeSync(pathInfo.targetPath)
  }
  catch (e) {
    // Nothing to delete
  }

  fs.copySync(pathInfo.sourcePath, pathInfo.targetPath)
  console.log(`👍 ${chalk.green(pathInfo.pluginDir)} copied into the plugins directory`)

  // Turn hot reloading off in Sketch
  enableSketchPluginHotloading(false)
}

if (require.main === module) {
  installPlugin()
}
else {
  module.exports = { installPlugin }
}
