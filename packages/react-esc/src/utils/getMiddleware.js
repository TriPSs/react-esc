import path from 'path'

const defaultSettings = {
  withApp    : false, // Also pass the app as second param: middleware(options, app)
  returnValue: null,  // This middleware returns a certain value that is what app.use needs
  local      : false, // Is package name a relative path?
}

export default function getMiddleware(app, config, mw, mwOptions = null, mwSettings = null) {
  // If the middleware is a array extract all the options and call this function again
  if (Array.isArray(mw)) {
    const [middleware, middlewareOptions, middlewareSettings] = mw

    return getMiddleware(app, config, middleware, middlewareOptions, middlewareSettings)
  }

  let settings = defaultSettings
  // If the given settings are not null then merge them with the default one
  if (mwSettings !== null) {
    settings = {
      ...defaultSettings,
      ...mwSettings,
    }
  }

  // Require the middleware
  let middleware = null
  if (!settings.local) {
    middleware = require(mw)

  } else {
    middleware = require(path.resolve(process.cwd(), mw))
  }

  // If we have a middleware continue otherwise return false
  if (middleware) {
    if (typeof middleware === 'function') {
      if (mwOptions !== null) {

        let options = mwOptions
        // If mwOptions a function execute it and use the return value as options instead
        if (typeof mwOptions === 'function') {
          options = mwOptions(config)

          // If the return value is false cancel the loading of this middleware
          if (typeof options === 'boolean' && options === false) {
            return false
          }
        }

        if (settings.withApp) {
          // Also give the app as argument
          middleware = middleware(options, app)

        } else {
          // Only give the options as argument
          middleware = middleware(options)
        }
      } else {
        // Just execute it
        middleware = middleware()
      }
    }

    // Get the return value
    if (settings.returnValue !== null) {
      middleware = middleware[settings.returnValue]
    }

    return middleware
  }

  return false
}
