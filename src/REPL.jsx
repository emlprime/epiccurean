import React from 'react';
import * as R from 'ramda';
import { Chart } from './Chart';
import { calcHitMatrix, calcDodgeMatrix } from './hitStats';
import { attacker, defender } from './Chart/data';
import { categories } from './Chart/constants';

const MIN = 1;
const MAX = 6;
const rolls = R.range(MIN, R.inc(MAX));
const validRoll = R.clamp(MIN, MAX);

const matchupResolver = (acc, match) => {
  console.log('match', match);
  return acc;
};

const evalMatchupResult = reduce(matchupResolver, 0);

const matchup = R.pipe(
  R.converge(R.xprod, [
    R.map(R.pipe(calcHitMatrix, R.applySpec)(attacker)),
    R.map(R.pipe(calcDodgeMatrix, R.applySpec)(defender)),
  ]),
  evalMatchupResult
)(rolls);

const matchupLength = R.length(matchup);
const result = { true: 12 };
const percent = R.pipe(R.divide(result['true']), R.multiply(100), (num) =>
  Math.round(num)
)(matchupLength);
const report = `After ${matchupLength} attempts Bob hits ${percent}%`;

const REPL = () => {
  const results = [report];

  return (
    <article>
      <pre>{JSON.stringify(R.last(results), null, 2)}</pre>
      <Chart
        categories={categories}
        attackerStats={attackerStats}
        defenderStats={defenderStats}
      />
    </article>
  );
};
export default REPL;
