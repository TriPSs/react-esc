const cssNano = require('cssnano')

const cssNanoDefaultConfig = {
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
}

module.exports = function postCss(config) {
  const { webpack } = config

  const cssNanoConfig = {}

  return {
    loader : 'postcss-loader',
    options: {
      sourceMap: true,
      plugins  : () => [
        cssNano(cssNanoConfig),
      ],
    },
  }
}
