const { CLIEngine } = require('eslint')

const cli = new CLIEngine({})

const tsPackages = ['packages/server/', 'packages/client/']

const extractPackage = file => /packages\/.*?\//.exec(file)?.[0]

module.exports = {
  '*.{j,t}s?(x)': files =>
    [
      'eslint --max-warnings=0 --fix ' +
        files.filter(file => !cli.isPathIgnored(file)).join(' '),
      'jest --ci --forceExit --findRelatedTests ' + files.join(' '),
    ].filter(Boolean),
  'packages/*/**/*.ts?(x)': files =>
    Array.from(new Set(files.map(extractPackage)))
      .filter(packageDir => tsPackages.includes(packageDir))
      .map(packageDir => {
        const localTsc = `${packageDir}node_modules/typescript/bin/tsc`
        const fs = require('fs')
        const tsc = fs.existsSync(localTsc) ? `node ${localTsc}` : 'tsc'
        return `${tsc} -b ${packageDir}`
      }),
  '*.({j,t}s?(x)|md?(x)|json|y?(a)ml)': 'prettier --write',
  'pnpm-lock.yaml': () => 'pnpm dedupe',
}
