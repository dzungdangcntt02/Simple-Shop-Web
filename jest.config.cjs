module.exports = {
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  transform: {},
  testRegex: '/tests/.*|(\\.|/)(test|spec)\\.([jt]sx?|[cm]js?)$',
  restoreMocks: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/src/config/', '/src/app.js', '/tests/'],
  testPathIgnorePatterns: [
    '<rootDir>/tests/helpers/',
  ],
};
