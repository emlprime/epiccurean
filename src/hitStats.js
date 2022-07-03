import * as R from 'ramda';

const calcInfluence = R.curry((skillCap, luckCap, rawSkill, rawLuck) => {
  const skill = R.clamp(0, skillCap, rawSkill);
  const luck = R.clamp(0, R.min(luckCap, R.subtract(100, skill)), rawLuck);
  return { skill, luck, result: R.add(skill, luck) };
});

const getRadius = R.pipe(R.propOr(0, 'height'), R.divide(R.__, 2));
const getWeaponLength = R.pathOr(0, ['weapon', 'length']);

const getBaseAttribute = R.curry((key) => R.pipe(R.propOr(0, key)));

// Influence Derivers
const deriveInfluence = R.curry((skillCap, luckCap, attr) =>
  R.pipe(getBaseAttribute(attr), calcInfluence(skillCap, luckCap))
);
const deriveInvertedInfluence = R.curry((skillCap, luckCap, attr) =>
  R.pipe(
    getBaseAttribute(attr),
    R.subtract(100),
    calcInfluence(skillCap, luckCap)
  )
);
const deriveComplexInfluence = R.curry((skillCap, luckCap, attrSelector) =>
  R.pipe(attrSelector, calcInfluence(skillCap, luckCap))
);

// Complex Selectors
const getMobilityRatio = R.pipe(
  R.converge(R.divide, [R.pathOr(0, ['weapon', 'mass']), R.propOr(1, 'str')]),
  Math.round,
  R.subtract(100)
);
const getReachRatio = R.converge(R.add, [getRadius, getWeaponLength]);

// Influence Derivers
//  Hit Influences
const deriveReachInfluence = deriveComplexInfluence(90, 60, getReachRatio);
const deriveAgilityInfluence = deriveComplexInfluence(95, 30, getMobilityRatio);
const deriveTargetingInfluence = deriveInfluence(95, 20, 'attention');
const deriveVisibilityInfluence = deriveInfluence(95, 20, 'vision');
const deriveCoverInfluence = deriveInfluence(70, 60, 'cover');
const deriveElevationInfluence = deriveInfluence(100, 0, 'elevation');

//  Dodge Influences
const deriveSizeInfluence = deriveInvertedInfluence(100, 0, 'volume');
const deriveEvasionInfluence = deriveInfluence(95, 20, 'reflex');
const deriveStanceInfluence = deriveInvertedInfluence(100, 0, 'silouhette');

export const calcHitMatrix = R.applySpec({
  reach: deriveReachInfluence,
  agility: deriveAgilityInfluence,
  targeting: deriveTargetingInfluence,
  visibility: deriveVisibilityInfluence,
  cover: deriveCoverInfluence,
  elevation: deriveElevationInfluence,
});
export const calcDodgeMatrix = R.applySpec({
  reach: deriveSizeInfluence,
  agility: deriveEvasionInfluence,
  targeting: deriveStanceInfluence,
  visibility: deriveVisibilityInfluence,
  cover: deriveCoverInfluence,
  elevation: deriveElevationInfluence,
});
