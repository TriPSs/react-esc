if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-esc-storage.production.js')
} else {
  module.exports = require('./cjs/react-esc-storage.development.js')
}
