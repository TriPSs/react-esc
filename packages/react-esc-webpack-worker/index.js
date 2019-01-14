module.exports = (config, options) => {
  return {
    module: {
      rules: [
        {
          test   : /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            'file-loader?hash=sha512&digest=hex&name=img/img-[name]-[hash:6].[ext]',
            {
              loader: 'image-webpack-loader',
              query : {
                pngquant: {
                  optimizationLevel: 7,
                  quality          : '65-90',
                  speed            : 4,
                },

                bypassOnDebug: true,

                mozjpeg: {
                  progressive: true,
                },

                optipng: {
                  optimizationLevel: 7,
                },

                gifsicle: {
                  interlaced: false,
                },
              },
            },
          ],
        },
      ],
    },
  }
}
