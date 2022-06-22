import React from 'react';
import * as R from 'ramda';

const wounds = [
  { amount: 2, location: 'rightarm' },
  { amount: 5, location: 'head' },
  { amount: 6, location: 'rightarm' },
  { amount: 3, location: 'rightarm' },
  { amount: 2, location: 'head' },
  { amount: 2, location: 'body' },
];

const REPL = () => {
  const results = [
    R.pipe(
      R.groupBy(R.prop('location')),
      R.map(
        R.pipe(
          R.pluck(['amount']),
          R.sum
        )
      )
      )(wounds)];
  return <pre>{JSON.stringify(R.last(results), null, 2)}</pre>;
};

export default REPL;
