if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-esc-render-jss.production.js')
} else {
  module.exports = require('./cjs/react-esc-render-jss.development.js')
}
