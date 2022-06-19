import React from 'react';
import * as R from 'ramda';

const rubric1 = {
  head: true,
  body: false,
  leftarm: true,
  rightarm: false,
  leftleg: true,
  rightleg: false,
  none: false
};
const rubric2 = {
  head: false,
  body: true,
  leftarm: true,
  rightarm: false,
  leftleg: true,
  rightleg: true,
  none: false
};

const oddsToHit = R.lt(R.__);
const calcBodyPartHitResult = R.applySpec({
  __odds: R.identity,
  head: oddsToHit(0.4),
  body: oddsToHit(0.8),
  leftarm: oddsToHit(0.2),
  rightarm: oddsToHit(0.8),
  leftleg: oddsToHit(0.1),
  rightleg: oddsToHit(0.7),
  none: R.F
});

const bodyPartOdds = {
  head: 4,
  body: 8,
  leftarm: 2,
  rightarm: 8,
  leftleg: 1,
  rightleg: 7,
  none: 20
};

const attack1 = {
  bodyPartIndex: 40,
  bodyPart: 'leftarm',
  targetRubric: rubric1,
};
const attack2 = { bodyPartIndex: 29, target: 'Bob', targetRubric: rubric2 };
const attack3 = {
  bodyPartIndex: 10,
  bodyPart: 'rightarm',
  targetRubric: rubric1,
};
const attack4 = { bodyPartIndex: 45, target: 'Bob', targetRubric: rubric1 };
const attacks = [attack1, attack2, attack3, attack4];

const didYouGetHit = (attack) => {
  const bodyPart = deriveBodyPart(attack);
  const rubric = R.prop('targetRubric', attack);
  const hit = R.prop(bodyPart, rubric);
  return hit;
};

const deriveBodyPart = (attack) =>
  R.propOr(getBodyPart(R.prop('bodyPartIndex', attack)), 'bodyPart')(attack);
//if it comes in without a bodypart target, should randomly select one
const deriveBodyParts = (odds, part) => R.repeat(part, odds);
const makeBodyBag = () =>
  R.pipe(R.mapObjIndexed(deriveBodyParts), R.values, R.flatten)(bodyPartOdds);

const bodyBag = makeBodyBag();
const getBodyPart = (index) => bodyBag[index];
const randomizeIndex = () => {
  const bodyBagLength = R.length(bodyBag);
  console.log(bodyBagLength)
  return Math.floor(Math.random() * bodyBagLength);
};

const REPL = () => {
  const result1 = R.map(calcBodyPartHitResult, R.times(Math.random, 5));
  const result2 = R.map(didYouGetHit, attacks);
  const result3 = getBodyPart(randomizeIndex());

  return <pre>{JSON.stringify(result2, null, 2)}</pre>;
};

export default REPL;
