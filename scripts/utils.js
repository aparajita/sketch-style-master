const path = require('path')

function getPathInfo() {
  const sketchPluginDir = `${process.env.HOME}/Library/Application Support/com.bohemiancoding.sketch3/Plugins`
  const { name } = require('../src/manifest.json')
  const pluginDir = `${name}.sketchplugin`
  const sourcePath = path.resolve(__dirname, `../${pluginDir}`)
  const targetPath = path.join(sketchPluginDir, pluginDir)

  return {
    sketchPluginDir,
    pluginDir,
    sourcePath,
    targetPath
  }
}

module.exports = {
  getPathInfo
}
