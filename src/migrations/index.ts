import * as migration_20261118_044341_uuidv7_baseline from './20261118_044341_uuidv7_baseline';
import * as migration_20261119_025414_contact_rate_limits from './20261119_025414_contact_rate_limits';

export const migrations = [
  {
    up: migration_20261118_044341_uuidv7_baseline.up,
    down: migration_20261118_044341_uuidv7_baseline.down,
    name: '20261118_044341_uuidv7_baseline',
  },
  {
    up: migration_20261119_025414_contact_rate_limits.up,
    down: migration_20261119_025414_contact_rate_limits.down,
    name: '20261119_025414_contact_rate_limits'
  },
];
