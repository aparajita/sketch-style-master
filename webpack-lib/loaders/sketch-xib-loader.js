'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { runIbTool } = require('./sketch-xib-loader-utils')

function compileXib(loader) {
  const parsedPath = path.parse(loader.resourcePath)
  const nibPath = path.join(os.tmpdir(), `webpack-${parsedPath.name}.nib`)
  const result = runIbTool(loader, ['--compile', nibPath, loader.resourcePath])

  if (result.status === 0) {
    try {
      return fs.readFileSync(nibPath)
    }
    catch (e) {
      loader.emitError(new Error(`Error reading compiled nib: ${e.message}`))
    }
    finally {
      fs.unlinkSync(nibPath)
    }
  }

  return ''
}

module.exports = function () {
  return compileXib(this)
}

module.exports.raw = true
