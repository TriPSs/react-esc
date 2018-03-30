import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

import lernaGetPackages from 'lerna-get-packages'
import path from 'path'

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH, NODE_ENV } = process.env
const PACKAGE_ROOT_PATH = process.cwd()
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, 'package.json'))

const ALL_MODULES = lernaGetPackages(LERNA_ROOT_PATH).map(
  ({ package: { name } }) => name,
)

const mirror = array => array.reduce((acc, val) => ({ ...acc, [val]: val }), {})

const formats = ['cjs']

const plugins = [
  resolve({
    only: [],
  }),
  json(),
  babel({
    plugins: [
      'transform-class-properties',
      require(`${LERNA_ROOT_PATH}/scripts/rollup/plugins/wrapWarningWithEnvCheck`),
    ],
    presets: [
      ['env', { modules: false }],
      ['es2015-rollup'],
      'react',
      'stage-0',
    ],
    exclude: 'node_modules/**',
    babelrc: false,
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    __DEV__               : NODE_ENV === 'production' ? 'false' : 'true',
  }),
  commonjs(),
]

if (NODE_ENV === 'production') {
  plugins.push(uglify())
}

console.log(mirror(ALL_MODULES))
export default formats.map(format => ({
  plugins: plugins,
  input  : path.join(PACKAGE_ROOT_PATH, 'src/index.js'),
  // globals  : mirror(ALL_MODULES),
  // external : IS_BROWSER_BUNDLE ? mirror(ALL_MODULES) : undefined,
  // external: mirror(ALL_MODULES),
  output : {
    sourcemap: true,
    name     : LERNA_PACKAGE_NAME,
    file     : path.join(
      path.join(PACKAGE_ROOT_PATH, format),
      `${LERNA_PACKAGE_NAME}.${NODE_ENV}.js`,
    ),
    format,
  },
}))
