module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@app/(.*)$': '<rootDir>/src/$1',
      '^@test/(.*)$': '<rootDir>/test/$1',
      '^@shared/(.*)$': '<rootDir>/src/shared/$1',
      '^@core/(.*)$': '<rootDir>/src/core/$1',
    },
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.spec.ts'],
    modulePaths: ['<rootDir>'],
    transform: {
      '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    },
  };
  