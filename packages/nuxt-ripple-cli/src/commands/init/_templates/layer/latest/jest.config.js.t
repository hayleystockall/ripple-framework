---
to: jest.config.js
---
export default {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '.*.test.(j|t)s[x]?$',
  transform: {
    '^.+\\.ts$': ['<rootDir>/node_modules/ts-jest'],
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lodash|@dpc-sdp/.*))']
}
