import React from 'react';
import * as R from 'ramda';

const rubric1 = {
  head: true,
  body: false,
  leftarm: true,
  rightarm: false,
  leftleg: true,
  rightleg: false,
  none: false,
};
const rubric2 = {
  head: false,
  body: true,
  leftarm: true,
  rightarm: false,
  leftleg: true,
  rightleg: true,
  none: false,
};

const oddsToHit = R.gt;
const calcBodyPartHitResult = R.applySpec({
  __odds: R.identity,
  head: oddsToHit(0.4),
  body: oddsToHit(0.8),
  leftarm: oddsToHit(0.2),
  rightarm: oddsToHit(0.8),
  leftleg: oddsToHit(0.1),
  rightleg: oddsToHit(0.7),
  none: R.F,
});


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



const deriveWoundAmount = (hitBundle) => {
  const isAttended = R.equals(
    R.prop('actorId', hitBundle),
    R.prop('targetOfTargetId', hitBundle)
  );
  console.log(hitBundle)
  const baseAmount = R.prop('amount', hitBundle);
  const amount = isAttended ? baseAmount / 2 : baseAmount * 2;
  return {isAttended, baseAmount, amount};
};

const deriveWound = (hitBundle) => {
  const woundAmountBundle =  deriveWoundAmount(hitBundle)
  const wound = {
    location: R.prop('bodyPart', hitBundle),
    attackType: 'stabbed',
    amount: R.prop('amount', woundAmountBundle),
    effect: 'bleeding',
  };
  return {wound, woundAmountBundle};

};

const deriveWoundNotification = (woundBundle) => {
  console.log(woundBundle)
  const {wound: {amount, attackType, location, effect}} = woundBundle
  return `TARGET got ${deriveDamageAdjective(amount)} ${attackType} in the ${location} and is now ${effect}`
}

const deriveDamageAdjective = R.cond([
  [R.lt(90), R.always('brutally')],
  [R.lt(60), R.always('severely')],
  [R.lt(30), R.always('moderately')],
  [R.T, R.always('mildly')],
])




export const calcAttack = (state, attack) => {
  const hitBundle = didYouGetHitDynamic(attack);
  if (R.prop('result', hitBundle)) {
    const woundBundle = deriveWound(hitBundle, attack);
    const wound = R.prop('wound', woundBundle)
    return { hitBundle, notification: deriveWoundNotification(woundBundle), wound };
  }
  return { hitBundle, notification: 'womp womp' };
};

const deriveBodyPart = (attack) =>
  R.propOr(getBodyPart(R.prop('bodyPartIndex', attack)), 'bodyPart')(attack);

const bodyPartOdds = {
    head: 4,
    body: 8,
    leftarm: 2,
    rightarm: 8,
    leftleg: 1,
    rightleg: 7,
    none: 20,
};
  

const generateBodyParts = (odds, part) => R.repeat(part, odds);
const makeBodyBag = () =>
  R.pipe(R.mapObjIndexed(generateBodyParts), R.values, R.flatten)(bodyPartOdds);
const bodyBag = makeBodyBag();
const getBodyPart = (index) => bodyBag[index];
const randomizeIndex = () => {
  const bodyBagLength = R.length(bodyBag);
  return Math.floor(Math.random() * bodyBagLength);
};

const didYouGetHit = (attack) => {
  const bodyPart = deriveBodyPart(attack);
  const rubric = R.prop('targetRubric', attack);
  const hit = R.prop(bodyPart, rubric);
  return hit;
};

const didYouGetHitDynamic = (attackBase = {}) => {
  const random = Math.random();
  const targetRubric = calcBodyPartHitResult(random);
  const bodyPartIndex = randomizeIndex();
  const bodyPart = getBodyPart(bodyPartIndex);
  const attack = R.mergeLeft({ targetRubric, bodyPartIndex }, attackBase);
  const result = didYouGetHit(attack);
  return { result, bodyPart, ...attack };
};

