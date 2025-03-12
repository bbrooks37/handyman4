module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/styleMock.js',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/fileMock.js'
    }
};
