import * as migration0 from './20261019_000000_init'
import * as migration1 from './20261107_000001_add_events_timezone'
import * as migration2 from './20261110_000002_site_settings_theme_and_assets'

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
  {
    name: '20261110_000002_site_settings_theme_and_assets',
    up: migration2.up,
    down: migration2.down,
  },
]
