import webpack from 'webpack'
import cssnano from 'cssnano'
import _debug from 'debug'

export const sassLoaderConfig = (include) => ({
  loader : 'sass-loader',
  options: {
    sourceMap   : true,
    outputStyle : 'expanded',
    includePaths: include,
  },
})

export const cssLoaderConfig = {
  loader : 'css-loader',
  options: {
    sourceMap     : true,
    minimize      : true,
    modules       : true,
    importLoaders : true,
    localIdentName: '[name]__[local]___[hash:base64:5]',
  },
}

export const postCssLoaderConfig = {
  loader : 'postcss-loader',
  options: {
    sourceMap: true,
    plugins  : () => [
      cssnano({
        discardComments: {
          removeAll: true,
        },
        discardUnused  : false,
        mergeIdents    : false,
        reduceIdents   : false,
        sourceMap      : true,
        safe           : true,
        autoprefixer   : {
          browsers: [
            'safari 9',
            'ie 10-11',
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'edge 13',
            'ios_saf 9.0-9.2',
            'ie_mob 11',
            'Android >= 4',
          ],
          cascade : false,
          add     : true,
          remove  : true,
        },
      }),
    ],
  },
}

export default (config) => {
  const debug = _debug('app:esc:webpack:config')
  const paths = config.utils_paths

  debug('Create generic configuration.')

  return {
    devtool: config.compiler_devtool,
    node   : {
      fs: 'empty',
    },
    resolve: {
      modules   : [
        paths.src(),
        'node_modules',
      ],
      extensions: [
        '.js',
        '.jsx',
        '.json',
      ],
      symlinks  : false,
    },
    module : {
      rules: [{
        test   : /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader : 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      }, {
        test   : /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=img/img-[name]-[hash:6].[ext]',
          {
            loader: 'image-webpack-loader',
            query : {
              bypassOnDebug: true,

              mozjpeg: {
                progressive: true,
                quality    : 65,
              },

              pngquant: {
                optimizationLevel: 7,
                quality          : '65-90',
                speed            : 4,
              },

              optipng: {
                optimizationLevel: 7,
              },

              gifsicle: {
                interlaced: true,
              },
            },
          },
        ],
      }, {
        test   : /\.(woff|woff2|otf|eot|ttf)$/i,
        loaders: ['file-loader?hash=sha512&digest=hex&name=fonts/font-[name]-[hash:6].[ext]'],
      }],
    },
    plugins: [
      new webpack.DefinePlugin({ ...config.globals, ...config.custom_globals }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    ],
  }
}
