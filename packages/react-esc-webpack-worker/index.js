module.exports = () => {
  return {
    module: {
      rules: [
        {
          test   : /\.worker\.js$/,
          loaders: ['worker-loader'],
        },
      ],
    },
  }
}
