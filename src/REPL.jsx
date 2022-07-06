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

const evalCategoricalResult = R.curry((match, category) =>
  R.converge(R.gt, [
    R.path([0, category, 'result']),
    R.path([1, category, 'result']),
  ])(match)
);

const matchupResolver = (acc, match) => {
  const result = R.map(evalCategoricalResult(match), categories)
  const successes = R.filter(R.identity, result)
  console.log(successes)

  return result ? R.inc(acc) : acc;
};

const calcAttackerResult = R.pipe(calcHitMatrix, R.applySpec)(attacker);
const calcDefenderResult = R.pipe(calcDodgeMatrix, R.applySpec)(defender);

const evalMatchupResult = R.reduce(matchupResolver, 0);
const matchupSuccesses = R.pipe(
  R.converge(R.xprod, [R.map(calcAttackerResult), R.map(calcDefenderResult)]),
  evalMatchupResult
)(rolls);
const matchupRounds = R.length(rolls);

const percent = R.pipe(R.divide(matchupSuccesses), R.multiply(100), (num) =>
  Math.round(num)
)(matchupRounds);
const report = `After ${matchupRounds} attempts Bob hits ${percent}%`;

const attackerStats = calcAttackerResult(1);
const defenderStats = calcDefenderResult(1);

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
