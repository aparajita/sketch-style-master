'use strict'

const { ConcatSource } = require('webpack-sources')

const prefix = `
var that = this;
function run (key, context) {
  that.context = context;

var exports =
`

const suffix = `
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}

that['onRun'] = run.bind(this, 'default');
`

class ExportSketchCommandsPlugin {
  constructor(manifest) {
    this.suffix = suffix
    const commands = manifest.commands.map(command => command.handler)
    commands.forEach(command => {
      this.suffix += `that['${command}'] = run.bind(this, '${command}');
`
    })
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ExportSketchCommandsPlugin', compilation => {
      compilation.hooks.optimizeChunkAssets.tapAsync('ExportSketchCommandsPlugin', (chunks, callback) => {
        chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            compilation.assets[file] = new ConcatSource(prefix, compilation.assets[file], this.suffix)
          })
        })

        callback()
      })
    })
  }
}

module.exports = ExportSketchCommandsPlugin
