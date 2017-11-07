const { execSync } = require('child_process')

const commandTemplate = '/usr/bin/defaults _action_ ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript _value_'

function enableSketchPluginHotloading(enable, alwaysShowStatus) {
  let cmd = commandTemplate.replace('_action_', 'read').replace('_value_', '')
  const output = execSync(cmd, { encoding: 'utf8' })
  const enabled = output.trim() === '1'
  const valueChanged = enabled !== enable

  if (valueChanged) {
    cmd = commandTemplate.replace('_action_', 'write').replace('_value_', `-bool ${enable ? 'YES' : 'NO'}`)
    execSync(cmd)
  }

  if (valueChanged || alwaysShowStatus) {
    console.log(`🔥 hot plugin reloading ${enable ? 'enabled' : 'disabled'} in Sketch`)
  }
}

if (require.main === module) {
  const arg = process.argv[2]
  enableSketchPluginHotloading(/(1|y(es)?|true)/i.test(arg), true)
}
else {
  module.exports = { enableSketchPluginHotloading }
}
