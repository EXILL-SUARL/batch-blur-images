import { Config } from '@jest/types'

// TODO: (in progress) exclude build so the npm test does not fail. UPDATE: Jest ignores tests in the build but TS still compiles them.
const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
}

export default config
