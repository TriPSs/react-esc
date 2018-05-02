import path from 'path'

const noop = () => {}

export default (dirs, cwd = null) => {
  let base = process.cwd()

  if (cwd === null) {
    if (typeof cwd === 'string') {
      base = path.resolve(base, cwd)
    }
  }

  return {
    src   : dirs.src ? base.bind(null, dirs.src) : noop,
    dist  : dirs.dist ? base.bind(null, dirs.dist) : noop,
    public: dirs.public ? base.bind(null, dirs.public) : noop,
    server: dirs.server ? base.bind(null, dirs.server) : noop,
  }
}
