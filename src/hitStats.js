import * as R from ramda

const defender = {
  speed: 5,
  dex: 10,
  mass: 20,
  height: 6,
  armor: {mass: 5, flexibility: 15},
  volume: 20,
}

const calcFactor = R.curry((luckGap, luck, normalizedStat) => {})

const calcInfluence = R.curry(
  (skillCap, luckCap, skill, luck) => 
  R.clamp(0, 100, 
    R.add(R.clamp(0, skillCap, skill), R.clamp(0, luckCap, luck))
       )
)

const attacker = {
  str: 50,
  dex: 10,
  mass: 20,
  height: 75,
  weapon: {length: 5, mass: 6000, complexity: 5, name: "bo staff"}, 
}
const getRadius = R.pipe(R.propOr(0, "height"), R.divide(R.__, 2))
const getWeaponLength = R.pathOr(0, ["weapon", "length"])
const getMobilityRatio = R.pipe(R.converge(R.divide, [
  pathOr(0, ["weapon", "mass"]), 
  propOr(1, "str")]), Math.round)
const getBaseReach = R.converge(R.add, [ getRadius, getWeaponLength ])

const calcReachInfluence = calcInfluence(90, 60)
const deriveReachInfluence = R.pipe(getBaseReach, calcReachInfluence)

const calcAgilityInfluence = calcInfluence(95, 30)
const getBaseMobility = R.converge(R.subtract, [R.always(100), getMobilityRatio])
const deriveAgilityInfluence = R.pipe(getBaseMobility, calcAgilityInfluence)


const hitMatrix = R.applySpec({
  reach: deriveReachInfluence,
  agility: deriveAgilityInfluence
})(attacker)

const dieRoll = 25

const contribution = {
  reach: 2,
  agility: 1
}

const contributionTotal = R.sum(R.values(contribution))

const normalizeContribution = R.flip(R.divide)(contributionTotal)
const normalizeReach = R.multiply(normalizeContribution(2))
const normalizeAgility = R.multiply(normalizeContribution(1))

const calcNormalizedHit = R.pipe(R.applySpec(hitMatrix),R.evolve({
  reach: normalizeReach,
  agility: normalizeAgility
}), R.values, R.sum, Math.round)

R.map(calcNormalizedHit, R.range(1, 100))














                         