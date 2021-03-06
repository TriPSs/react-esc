import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import path from 'path'

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH, NODE_ENV } = process.env
const PACKAGE_ROOT_PATH = process.cwd()
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, 'package.json'))

const formats = ['cjs']

const plugins = [
  resolve({
    only: [],
  }),
  json(),
  babel({
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-syntax-dynamic-import',

      require(`${LERNA_ROOT_PATH || (PACKAGE_ROOT_PATH + '/../..')}/scripts/rollup/plugins/wrapWarningWithEnvCheck`),
    ],

    presets: [
      ['@babel/preset-env', { modules: false }],
      '@babel/preset-react',
    ],

    runtimeHelpers: true,
    exclude       : 'node_modules/**',
    babelrc       : false,
  }),
  commonjs(),
]

if (NODE_ENV === 'production') {
  plugins.push(uglify())
}

export default formats.map(format => ({
  plugins: plugins,
  input  : path.join(PACKAGE_ROOT_PATH, 'src/index.js'),

  output: {
    sourcemap: true,
    name     : LERNA_PACKAGE_NAME,
    file     : path.join(
      path.join(PACKAGE_ROOT_PATH, format),
      `${PKG_JSON.name}.${NODE_ENV || 'development'}.js`,
    ),
    format,
  },
}))
