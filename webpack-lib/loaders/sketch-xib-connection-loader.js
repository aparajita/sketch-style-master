'use strict'

const path = require('path')
const plist = require('plist')
const { runIbTool } = require('./sketch-xib-loader-utils')

function writeConnectionsPlist(loader) {
  const parsedPath = path.parse(loader.resourcePath)
  const xibPath = path.join(parsedPath.dir, `${parsedPath.name}.xib`)
  const args = ['--connections', xibPath]
  const result = runIbTool(loader, args)

  if (result.status !== 0) {
    return ''
  }

  // Extract only the info we need and return JSON
  const parsedPlist = plist.parse(result.stdout)

  if (parsedPlist) {
    const connections = {
      outlets: [],
      actions: []
    }

    const connectionDict = parsedPlist['com.apple.ibtool.document.connections'] || {}

    for (const key of Object.keys(connectionDict)) {
      const connection = connectionDict[key]

      if (connection.type == 'IBCocoaOutletConnection') {
        if (!/initialFirstResponder|nextKeyView/.test(connection.label)) {
          connections.outlets.push(connection.label)
        }
      }
      else if (connection.type == 'IBCocoaActionConnection') {
        connections.actions.push(connection.label)
      }
    }

    return JSON.stringify(connections, null, 2)
  }
  else {
    loader.emit(new Error('Error parsing connections plist'))
    return ''
  }
}

module.exports = function () {
  return writeConnectionsPlist(this)
}

module.exports.raw = true
