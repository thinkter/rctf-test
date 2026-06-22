module.exports = api => {
  api.cache(() => process.env.NODE_ENV)

  return {
    plugins: [
      [
        'const-enum',
        {
          transform: 'constObject',
        },
      ],
    ],
    presets: [
      [
        '@babel/preset-typescript',
        {
          allowDeclareFields: true,
        },
      ],
      [
        '@babel/preset-env',
        {
          targets: { esmodules: true },
          bugfixes: true,
        },
      ],
    ],
  }
}
