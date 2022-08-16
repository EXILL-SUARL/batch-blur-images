import { Config } from '@jest/types'

// TODO: exclude build so the npm test does not fail
const config: Config.InitialOptions = {
  preset: `ts-jest/presets/default-esm`,
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': `$1`,
  },
}

export default config
