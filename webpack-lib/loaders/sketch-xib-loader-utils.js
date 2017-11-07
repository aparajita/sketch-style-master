'use strict'

const path = require('path')
const plist = require('plist')
const { spawnSync } = require('child_process')

function runIbTool(loader, args) {
  const parsedPath = path.parse(loader.resourcePath)
  const xibPath = path.join(parsedPath.dir, `${parsedPath.name}.xib`)
  const mPath = path.join(parsedPath.dir, `${parsedPath.name}.m`)

  // Tell webpack to cache the compiled file and to track changes to the source files
  loader.cacheable && loader.cacheable()
  loader.addDependency(xibPath);
  loader.addDependency(mPath)

  const result = spawnSync('/usr/bin/ibtool', args, { encoding: 'utf8' })

  if (result.status === 0) {
    return result
  }
  else {
    let msg

    if (result.error) {
      msg = result.error.message
    }
    else {
      msg = getIbtoolError(result.stdout)
    }

    loader.emitError(new Error(`Error compiling ${parsedPath.base}: ${msg}`))
  }

  return null
}

function getIbtoolError(stdout) {
  const pl = plist.parse(stdout)
  const errors = pl['com.apple.ibtool.errors'] || []
  return errors[0].description
}

module.exports = {
  runIbTool
}
