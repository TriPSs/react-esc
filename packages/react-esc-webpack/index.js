if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-esc-webpack.production.js')
} else {
  module.exports = require('./cjs/react-esc-webpack.development.js')
}
