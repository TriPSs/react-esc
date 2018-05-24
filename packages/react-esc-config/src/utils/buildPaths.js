import path from 'path'

const noop = () => {}

export default (dirs, cwd = null, root = null) => {
  let base = process.cwd()

  if (cwd === null) {
    if (typeof cwd === 'string') {
      base = path.resolve(base, cwd)
    }
  }

  base = (...args) => Reflect.apply(path.resolve, base, [...args])

  const server = dirs.server ? base(dirs.server) : path.join(root, 'server.js')
  const client = dirs.client ? base(dirs.client) : path.join(root, 'client.js')

  return {
    src   : dirs.src ? base.bind(null, dirs.src) : noop,
    dist  : dirs.dist ? base.bind(null, dirs.dist) : noop,
    public: dirs.public ? base.bind(null, dirs.public) : noop,
    server,
    client,
  }
}
