import * as R from 'ramda';

const defender = {
  speed: 5,
  dex: 10,
  mass: 20,
  height: 6,
  armor: { mass: 5, flexibility: 15 },
  volume: 20,
};

const calcInfluence = R.curry((skillCap, luckCap, rawSkill, rawLuck) => {
  const skill = R.clamp(0, skillCap, rawSkill);
  const luck = R.clamp(0, R.min(luckCap, R.subtract(100, skill)), rawLuck);
  return { skill, luck, result: R.add(skill, luck) };
});

const getRadius = R.pipe(R.propOr(0, 'height'), R.divide(R.__, 2));
const getWeaponLength = R.pathOr(0, ['weapon', 'length']);
const getMobilityRatio = R.pipe(
  R.converge(R.divide, [R.pathOr(0, ['weapon', 'mass']), R.propOr(1, 'str')]),
  Math.round
);

const getBaseAttribute = R.curry((key) => R.pipe(R.propOr(0, key)));
const deriveInfluence = R.curry((skillCap, luckCap, attr) =>
  R.pipe(getBaseAttribute(attr), calcInfluence(skillCap, luckCap))
)
const getBaseReach = R.converge(R.add, [getRadius, getWeaponLength]);

const calcReachInfluence = calcInfluence(90, 60);
const deriveReachInfluence = R.pipe(getBaseReach, calcReachInfluence);

const calcAgilityInfluence = calcInfluence(95, 30);
const getBaseMobility = R.converge(R.subtract, [
  R.always(100),
  getMobilityRatio,
]);
const deriveAgilityInfluence = R.pipe(getBaseMobility, calcAgilityInfluence);

const getBaseTargeting = R.pipe(R.propOr(0, 'attention'));
const calcTargetingInfluence = calcInfluence(95, 20);
const deriveTargetingInfluence = R.pipe(
  getBaseTargeting,
  calcTargetingInfluence
);

const deriveVisibilityInfluence = deriveInfluence(95, 20, 'vision');

const getBaseCover = R.pipe(R.propOr(0, 'cover'));
const calcCoverInfluence = calcInfluence(70, 60);
const deriveCoverInfluence = R.pipe(getBaseCover, calcCoverInfluence);

const getBaseElevation = R.pipe(R.propOr(0, 'elevation'));
const calcElevationInfluence = calcInfluence(100, 0);
const deriveElevationInfluence = R.pipe(
  getBaseElevation,
  calcElevationInfluence
);

export const calcHitMatrix = R.applySpec({
  reach: deriveReachInfluence,
  agility: deriveAgilityInfluence,
  targeting: deriveTargetingInfluence,
  visibility: deriveVisibilityInfluence,
  cover: deriveCoverInfluence,
  elevation: deriveElevationInfluence,
});
