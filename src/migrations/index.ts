import * as migration0 from './20261019_000000_init'

export const migrations = [
  {
    name: '20261019_000000_init',
    up: migration0.up,
    down: migration0.down,
  },
]
