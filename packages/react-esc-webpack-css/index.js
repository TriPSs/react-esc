if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-esc-webpack-css.production.js')
} else {
  module.exports = require('./cjs/react-esc-webpack-css.development.js')
}
