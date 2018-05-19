import path from 'path'

const noop = () => {}

export default (dirs, cwd = null, root = null) => {
  let base = process.cwd()

  if (cwd === null) {
    if (typeof cwd === 'string') {
      base = path.resolve(base, cwd)
    }
  }

  let server = dirs.server ? base.bind(null, dirs.server) : noop
  let client = dirs.client ? base.bind(null, dirs.client) : noop

  return {
    src   : dirs.src ? base.bind(null, dirs.src) : noop,
    dist  : dirs.dist ? base.bind(null, dirs.dist) : noop,
    public: dirs.public ? base.bind(null, dirs.public) : noop,
    server,
    client,
  }
}
