import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

export default {

  context      : 'null',
  moduleContext: 'null',

  plugins: [
    resolve(),

    babel({
      babelrc: false,

      plugins: [
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
      ],

      runtimeHelpers: true,

      exclude: /node_modules/,
    }),
  ],

}
