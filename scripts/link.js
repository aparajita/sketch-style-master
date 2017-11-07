const chalk = require('chalk')
const fs = require('fs-extra')
const { enableSketchPluginHotloading } = require('./enable-sketch-plugin-hotloading')
const utils = require('./utils')

function linkPlugin() {
  const pathInfo = utils.getPathInfo()

  // Delete an existing plugin or symlink if it exists
  try {
    fs.removeSync(pathInfo.targetPath)
  }
  catch (e) {
    // There was nothing to delete
  }

  // Make a new symlink
  fs.ensureSymlinkSync(pathInfo.sourcePath, pathInfo.targetPath)
  console.log(`👍 ${chalk.green(pathInfo.pluginDir)} symlinked into the plugins directory`)

  // Turn hot reloading on in Sketch
  enableSketchPluginHotloading(true)
}

if (require.main === module) {
  linkPlugin()
}
else {
  module.exports = { linkPlugin }
}
