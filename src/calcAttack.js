import React from 'react';
import * as R from 'ramda';

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

const deriveWoundAmount = (hitBundle) => {
  const isAttended = R.equals(
    R.prop('actorId', hitBundle),
    R.prop('targetOfTargetId', hitBundle)
  );
  const baseAmount = R.prop('amount', hitBundle);
  const amount = isAttended ? baseAmount / 2 : baseAmount * 2;
  return { isAttended, baseAmount, amount };
};

const deriveWound = (hitBundle) => {
  const woundAmountBundle = deriveWoundAmount(hitBundle);
  const wound = R.mergeLeft(
    R.applySpec({
      actorId: R.prop('actorId'),
      target: R.prop('target'),
      location: R.prop('bodyPart'),
      attackType: R.prop('attackType'),
    })(hitBundle),
    { amount: R.prop('amount', woundAmountBundle), effect: 'bleeding' }
  );
  return { wound, woundAmountBundle };
};

const deriveWoundNotification = (state, woundBundle) => {
  const {
    wound: { target, actorId, amount, attackType, location, effect },
  } = woundBundle;
  const targetName = R.path(['actors', target, 'name'], state);
  const actorName = R.path(['actors', actorId, 'name'], state);
  return `${targetName} got ${deriveDamageAdjective(
    amount
  )} ${attackType} in the ${location} by ${actorName} and is now ${effect}`;
};

const deriveDamageAdjective = R.cond([
  [R.lt(90), R.always('brutally')],
  [R.lt(60), R.always('severely')],
  [R.lt(30), R.always('moderately')],
  [R.T, R.always('mildly')],
]);

export const calcAttack = (state, attack) => {
  const hitBundle = didYouGetHitDynamic(attack);
  if (R.prop('result', hitBundle)) {
    const woundBundle = deriveWound(hitBundle);
    const wound = R.prop('wound', woundBundle);
    return {
      hitBundle,
      notification: deriveWoundNotification(state, woundBundle),
      wound,
    };
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
