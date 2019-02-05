module.exports = {

  'presets': [
    '@babel/preset-env',
    '@babel/preset-react',
  ],

  'plugins': [
    [
      '@babel/plugin-proposal-decorators',
      {
        'legacy': true,
      },
    ],
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-react-display-name',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],

}
