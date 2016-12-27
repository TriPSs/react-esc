import webpack from 'webpack'

export default (config) => {

  const BASE_CSS_LOADER               = 'css?sourceMap&-minimize'
  const PATHS_TO_TREAT_AS_CSS_MODULES = [
    // 'react-toolbox', (example)
  ]

  PATHS_TO_TREAT_AS_CSS_MODULES.push(
    config.utils_paths.src().replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
  )

  const cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES.join('|')})`)

  const cssModulesLoader = [
    BASE_CSS_LOADER,
    'modules',
    'importLoaders=1',
    'localIdentName=[name]__[local]___[hash:base64:5]'
  ].join('&')

  return {
    devtool: config.compiler.devtool,

    resolve: {
      root      : config.path.src(),
      extensions: ['', '.js', '.jsx', '.json']
    },

    plugins: [
      new webpack.DefinePlugin(config.globals)
    ],

    module: {
      loaders: [
        {
          test   : /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader : 'babel',
          query  : {
            cacheDirectory: true,
            // plugins: ['transform-runtime'],
            presets       : ['es2015', 'react', 'stage-0']
          }
        }, {
          test  : /\.json$/,
          loader: 'json'
        }, {
          test   : /\.scss$/,
          include: cssModulesRegex,
          loaders: [
            'simple-universal-style',
            cssModulesLoader,
            'postcss',
            'sass?sourceMap'
          ]
        }, {
          test   : /\.css$/,
          include: cssModulesRegex,
          loaders: [
            'simple-universal-style',
            cssModulesLoader,
            'postcss'
          ]
        }, {
          test  : /\.woff(\?.*)?$/,
          loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
        }, {
          test  : /\.woff2(\?.*)?$/,
          loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
        }, {
          test  : /\.otf(\?.*)?$/,
          loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
        }, {
          test  : /\.ttf(\?.*)?$/,
          loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
        }, {
          test  : /\.eot(\?.*)?$/,
          loader: 'file?prefix=fonts/&name=[path][name].[ext]'
        }, {
          test  : /\.svg(\?.*)?$/,
          loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
        }, {
          test  : /\.(png|jpg)$/,
          loader: 'url?limit=8192'
        }
      ]
    }
  }
}
