const base = require('../../jest.base.config.js')

module.exports = {
  ...base,
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        cwd: __dirname,
      },
    ],
  },
}
