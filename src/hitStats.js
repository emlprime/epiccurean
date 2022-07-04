import * as R from 'ramda';

const calcInfluence = R.curry((name, skillCap, luckCap, rawSkill, rawLuck) => {
  const skill = R.clamp(0, skillCap, rawSkill);
  const luck = R.clamp(0, R.min(luckCap, R.subtract(100, skill)), rawLuck);
  return { skill, luck, result: R.add(skill, luck), name };
});

const getRadius = R.pipe(R.propOr(0, 'height'), R.divide(R.__, 2));
const getWeaponLength = R.pathOr(0, ['weapon', 'length']);

const getBaseAttribute = R.curry((key) => R.pipe(R.propOr(0, key)));

// Influence Derivers
const deriveInfluence = R.curry((name, skillCap, luckCap, attr) =>
  R.pipe(getBaseAttribute(attr), calcInfluence(name, skillCap, luckCap))
);
const deriveInvertedInfluence = R.curry((name, skillCap, luckCap, attr) =>
  R.pipe(
    getBaseAttribute(attr),
    R.subtract(100),
    calcInfluence(name, skillCap, luckCap)
  )
);

const deriveComplexInfluence = R.curry(
  (name, skillCap, luckCap, attrSelector) =>
    R.pipe(attrSelector, calcInfluence(name, skillCap, luckCap))
);

// Complex Selectors
const getMobilityRatio = R.pipe(
  R.converge(R.divide, [R.pathOr(0, ['weapon', 'mass']), R.propOr(1, 'str')]),
  Math.round,
  R.subtract(100)
);
const getReachRatio = R.converge(R.add, [getRadius, getWeaponLength]);
const getWeaponPenetration = R.pipe(
  R.converge(R.divide, [
    R.pathOr(0, ['weapon', 'mass']),
    R.pathOr(100, ['weapon', 'pointWidth']),
  ]),
  Math.round
);

// Influence Derivers
//  Hit Influences
const deriveReachInfluence = deriveComplexInfluence(
  'reach',
  90,
  60,
  getReachRatio
);
const deriveAgilityInfluence = deriveComplexInfluence(
  'weapon handling',
  95,
  30,
  getMobilityRatio
);
const deriveTargetingInfluence = deriveInfluence(
  'attention',
  95,
  20,
  'attention'
);
const deriveVisibilityInfluence = deriveInfluence('vision', 95, 20, 'vision');
const derivePenetrationInfluence = deriveComplexInfluence(
  'penetration',
  95,
  60,
  getWeaponPenetration
);
const deriveElevationInfluence = deriveInfluence(
  'elevation',
  100,
  0,
  'elevation'
);

//  Dodge Influences
const deriveSizeInfluence = deriveInvertedInfluence('volume', 100, 0, 'volume');
const deriveEvasionInfluence = deriveInfluence('reflex', 95, 20, 'reflex');
const deriveStanceInfluence = deriveInvertedInfluence(
  'silouhette',
  100,
  0,
  'silouhette'
);
const deriveOpacityInfluence = deriveInvertedInfluence(
  'opacity',
  100,
  0,
  'opacity'
);
const deriveCoverInfluence = deriveInfluence('cover', 70, 60, 'cover');

export const calcHitMatrix = R.applySpec({
  reach: deriveReachInfluence,
  agility: deriveAgilityInfluence,
  targeting: deriveTargetingInfluence,
  visibility: deriveVisibilityInfluence,
  cover: derivePenetrationInfluence,
  elevation: deriveElevationInfluence,
});
export const calcDodgeMatrix = R.applySpec({
  reach: deriveSizeInfluence,
  agility: deriveEvasionInfluence,
  targeting: deriveStanceInfluence,
  visibility: deriveOpacityInfluence,
  cover: deriveCoverInfluence,
  elevation: deriveElevationInfluence,
});
