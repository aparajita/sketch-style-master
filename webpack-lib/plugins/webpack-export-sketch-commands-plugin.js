'use strict';

const { ConcatSource } = require('webpack-sources');

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
    compiler.plugin('compilation', compilation => {
      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
        chunks.forEach(chunk => {
          if (!chunk.isInitial()) {
            return
          }

          chunk.files.forEach(file => {
            compilation.assets[file] = new ConcatSource(prefix, compilation.assets[file], this.suffix)
          })
        }) // chunks.forEach

        callback()
      }) // compilation.plugin('optimize-chunk-assets')
    }) // compiler.plugin('compilation')
  }
}

module.exports = ExportSketchCommandsPlugin
