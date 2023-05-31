module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
    resetMocks: false,
    setupFiles: ["jest-localstorage-mock"]
};
