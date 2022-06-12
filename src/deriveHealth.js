import * as R from 'ramda';

export const deriveHealth = R.curry((maxHealth, wounds) =>
  R.pipe(
    R.pluck('amount'),
    R.sum,
    R.subtract(maxHealth),
    R.clamp(0, maxHealth)
  )(wounds)
);
