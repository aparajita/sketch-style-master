'use strict'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const NpmInstallPlugin = require('npm-install-webpack-plugin')
const path = require('path')
const PrependAppendPlugin = require('./plugins/webpack-export-sketch-commands-plugin')
const uuid = require('uuid/v1')

const manifest = require('../src/manifest.json')

/*
  Because of the way webpack works, we have to import dependent files like xibs and their related .m files
  in the entry .js file. We want the .js file to be recompiled if the xib or .m file changes. But we don't
  want to save the generated nib and connection plist file with a hashed filename. Webpack won't recompile
  the .js file if an import doesn't export a changed value, and we don't need the export from xibs or .m files,
  so we just return a uuid, which ensures that when a xib or .m file changes, the .js file will be recompiled
  as well. I couldn't figure out any other way to force webpack to do this...
 */
function forceRecompile() {
  return uuid()
}

function getPluginConfig() {
  const plugin = `${manifest.name}.sketchplugin`

  return {
    entry: './src/plugin.js',
    manifest: './src/manifest.json',
    target: `./${plugin}`,
    resources: `./${plugin}/Contents/Resources`
  }
}

function makeConfig(pluginConfig, options) {
  const { nib } = options
  const projectDir = path.dirname(__dirname)

  const config = {
    context: projectDir,

    entry: pluginConfig.entry,

    output: {
      filename: 'plugin.js',
      path: path.resolve(projectDir, pluginConfig.target, 'Contents/Sketch')
    },

    target: 'node',

    module: {
      rules: [
        {
          test: /\.js$/,
          include: /\bsrc\b/,
          exclude: /\bnib\b/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                presets: ['env']
              }
            }
          ]
        }
      ]
    },

    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'loaders')
      ]
    },

    plugins: [
      new CopyWebpackPlugin([
          {
            from: path.resolve(projectDir, 'resources'),
            to: path.resolve(projectDir, pluginConfig.resources)
          },
          {
            from: path.resolve(projectDir, 'src/manifest.json')
          }
        ]
      ),
      new PrependAppendPlugin(manifest),
      new NpmInstallPlugin()
    ]
  }

  if (nib) {
    configNib(config)
  }

  return config
}

function configNib(config) {

  // The bundle resources path is relative to the skpm webpack config output.path, which is <plugin>/Sketch
  const nibOutputPath = `../Resources/${manifest.nibBundle}/Contents/Resources/`

  const nibConfig = {
    module: {
      rules: [
        {
          test: /\.xib$/,
          include: /\bnib\b/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].nib',
                outputPath: nibOutputPath,
                publicPath: forceRecompile
              }
            },
            'sketch-xib-loader'
          ]
        },
        {
          test: /\.m$/,
          include: /\bnib\b/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `[name].json`,
                outputPath: nibOutputPath,
                publicPath: forceRecompile
              }
            },
            'sketch-xib-connection-loader'
          ]
        }
      ]
    }
  }

  config.module.rules = config.module.rules.concat(nibConfig.module.rules)
}

module.exports = {
  getPluginConfig,
  makeConfig
}
