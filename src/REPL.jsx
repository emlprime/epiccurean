import React from 'react';
import * as R from 'ramda';
import Chart from './Chart';

const MIN = 1;
const MAX = 6;
const rolls = R.range(MIN, R.inc(MAX));
const validRoll = R.clamp(MIN, MAX);

const logValue = R.pipe(Math.log, R.multiply(40), R.divide(R.__, 100), R.inc);

const calcPlayerAContext = R.assoc('luck', R.__, { dex: 10, strength: 100 });
const calcPlayerBContext = R.assoc('luck', R.__, { dex: 100, size: 10 });

const matchup = R.converge(R.xprod, [
  R.map(calcPlayerAContext),
  R.map(calcPlayerBContext),
])(rolls);

const applyHitModifiers = ({ luck, dex, strength }) => {
  const result = strength + R.multiply(logValue(dex), luck);
  return strength;
};

const applyDodgeModifiers = ({ luck, dex, size }) => {
  const result = R.multiply(logValue(dex), luck);
  return result;
};

const calcHit = R.pipe(applyHitModifiers);
const calcDodge = R.pipe(applyDodgeModifiers);

const calcHitResult = ([a, b]) => {
  const hitA = calcHit(a);
  const dodgeB = calcDodge(b);
  const result = R.gt(hitA, dodgeB);
  return result;
};

const result = R.pipe(
  R.map(calcHitResult),
  R.groupBy(R.identity),
  R.map(R.length)
)(matchup);

const matchupLength = R.length(matchup);
const percent = R.pipe(R.divide(result['true']), R.multiply(100), (num) =>
  Math.round(num)
)(matchupLength);
const report = `After ${matchupLength} attempts Bob hits ${percent}%`;

const REPL = () => {
  const results = [report];

  return (
    <article>
      <pre>{JSON.stringify(R.last(results), null, 2)}</pre>;
      <Chart />;
    </article>
  );
};
export default REPL;
