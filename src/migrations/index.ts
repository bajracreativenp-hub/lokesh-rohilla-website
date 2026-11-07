import * as migration0 from './20261019_000000_init'
import * as migration1 from './20261107_000001_add_events_timezone'

export const migrations = [
  {
    name: '20261019_000000_init',
    up: migration0.up,
    down: migration0.down,
  },
  {
    name: '20261107_000001_add_events_timezone',
    up: migration1.up,
    down: migration1.down,
  },
]
