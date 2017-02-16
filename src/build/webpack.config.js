import webpack from 'webpack'
import cssnano from 'cssnano'
import _debug from 'debug'

export default (config) => {

  const debug = _debug('app:esc:webpack:config')
  const paths = config.utils_paths

  debug('Create generic configuration.')
  const webpackConfig = {
    devtool: config.compiler_devtool,
    resolve: {
      root      : paths.src(),
      extensions: ['', '.js', '.jsx', '.json']
    },
    module : {
      loaders: []
    }
  }

  // ------------------------------------
  // Plugins
  // ------------------------------------
  webpackConfig.plugins = [
    new webpack.DefinePlugin(config.globals)
  ]

  if (config.custom_globals) {
    webpackConfig.plugins.push(new webpack.DefinePlugin(config.custom_globals))
  }

  // ------------------------------------
  // Loaders
  // ------------------------------------
  // JavaScript / JSON / IMAGES
  webpackConfig.module.loaders = [
    {
      test   : /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader : 'babel',
      query  : {
        cacheDirectory: true,
        plugins       : ['transform-runtime', "transform-decorators-legacy"],
        presets       : ['es2015', 'react', 'stage-0']
      }
    }, {
      test  : /\.json$/,
      loader: 'json'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=img/img-[name]-[hash:6].[ext]',
        'image-webpack-loader'
      ]
    }
  ]

  // Config images loader
  webpackConfig.imageWebpackLoader = {
    bypassOnDebug: true,
    optipng: {
      optimizationLevel: 7
    },
    gifsicle: {
      interlaced: false
    }
  }

  // ------------------------------------
  // Style Loaders
  // ------------------------------------
  // We use cssnano with the postcss loader, so we tell
  // css-loader not to duplicate minimization.
  const BASE_CSS_LOADER = 'css?sourceMap&-minimize'

  // Add any packge names here whose styles need to be treated as CSS modules.
  // These paths will be combined into a single regex.
  const PATHS_TO_TREAT_AS_CSS_MODULES = [
    // 'react-toolbox', (example)
  ]

  // If config has CSS modules enabled, treat this project's styles as CSS modules.
  if (config.compiler_css_modules) {
    PATHS_TO_TREAT_AS_CSS_MODULES.push(
      paths.src().replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
    )
  }

  const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length
  const cssModulesRegex   = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES.join('|')})`)

  // Loaders for styles that need to be treated as CSS modules.
  if (isUsingCSSModules) {
    const cssModulesLoader = [
      BASE_CSS_LOADER,
      'modules',
      'importLoaders=1',
      'localIdentName=[name]__[local]___[hash:base64:5]'
    ].join('&')

    webpackConfig.module.loaders.push({
      test   : /\.scss$/,
      include: cssModulesRegex,
      loaders: [
        'simple-universal-style',
        cssModulesLoader,
        'postcss',
        'sass?sourceMap'
      ]
    })

    webpackConfig.module.loaders.push({
      test   : /\.css$/,
      include: cssModulesRegex,
      loaders: [
        'simple-universal-style',
        cssModulesLoader,
        'postcss'
      ]
    })
  }

  // Loaders for files that should not be treated as CSS modules.
  const excludeCSSModules = isUsingCSSModules ? cssModulesRegex : false
  webpackConfig.module.loaders.push({
    test   : /\.scss$/,
    exclude: excludeCSSModules,
    loaders: [
      'simple-universal-style',
      BASE_CSS_LOADER,
      'postcss',
      'sass?sourceMap'
    ]
  })
  webpackConfig.module.loaders.push({
    test   : /\.css$/,
    exclude: excludeCSSModules,
    loaders: [
      'simple-universal-style',
      BASE_CSS_LOADER,
      'postcss'
    ]
  })

  // ------------------------------------
  // Style Configuration
  // ------------------------------------
  webpackConfig.sassLoader = {
    includePaths: paths.src('styles')
  }

  webpackConfig.postcss = [
    cssnano({
      autoprefixer   : {
        add     : true,
        remove  : true,
        browsers: ['last 2 versions']
      },
      discardComments: {
        removeAll: true
      },
      discardUnused  : false,
      mergeIdents    : false,
      reduceIdents   : false,
      safe           : true,
      sourcemap      : true
    })
  ]

  // File loaders
  /* eslint-disable */
  webpackConfig.module.loaders.push({
      test  : /\.woff(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
    },
    {
      test  : /\.woff2(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
    },
    {
      test: /\.otf(\?.*)?$/,
      loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
    },
    {
      test  : /\.ttf(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
    },
    {
      test: /\.eot(\?.*)?$/,
      loader: 'file?prefix=fonts/&name=[path][name].[ext]'
    },
    {
      test: /\.svg(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
    })
  /* eslint-enable */

  return webpackConfig

}
