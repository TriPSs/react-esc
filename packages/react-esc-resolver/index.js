if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-esc-resolver.production.js')
} else {
  module.exports = require('./cjs/react-esc-resolver.development.js')
}
