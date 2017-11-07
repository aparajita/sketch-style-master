'use strict'

const chalk = require('chalk')
const fs = require('fs')
const manifest = require('../src/manifest.json')
const path = require('path')

const sourceTemplate = `'use strict'

// webpack build dependency
import './manifest.json'

// Export * from all of the commands
`

function buildPluginJS() {
  const commandDefs = manifest.commands || []
  const commands = commandDefs.map(command => command.handler)
  const exportedFunctions = []

  // Gather all of the exported command functions from command sources
  const commandsDir = path.resolve(__dirname, '../src/commands')
  const commandFiles = fs.readdirSync(commandsDir)

  for (const file of commandFiles) {
    const source = fs.readFileSync(path.join(commandsDir, file), { encoding: 'utf8' })

    let match
    const re = /^export\s+function\s+(\w+)\s*\(\s*context\s*\)/gm
    re.lastIndex = 0

    do {
      match = re.exec(source)

      if (match) {
        exportedFunctions.push({
          filename: path.basename(file),
          func: match[1]
        })
      }
    }
    while (match)
  }

  // Make sure all of the commands in the manifest have been exported
  let valid = true

  for (let command of commands) {
    const finder = value => {
      return value.func === command
    }

    if (!exportedFunctions.find(finder)) {
      console.log(`👎 The manifest command ${chalk.red(command)} has not been exported from any command source file.`)
      valid = false
    }
  }

  if (valid) {
    const exportStatments = commandFiles.map(filename => `export * from './commands/${filename}'`)
    const source = sourceTemplate + exportStatments.join('\n') + '\n'

    fs.writeFileSync(path.resolve(__dirname, '../src/plugin.js'), source, { encoding: 'utf8' })
  }

  return valid
}

if (require.main === module) {
  process.exit(buildPluginJS() ? 0 : 1)
}
else {
  module.exports = { buildPluginJS }
}
