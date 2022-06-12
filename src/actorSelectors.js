import * as R from "ramda";
import {deriveHealth} from './deriveThings'

const getCharacterFromState = R.curry((actors, plannedMoves, key, i) =>
  R.pipe(
    R.prop(R.__, actors),
    R.assoc("position", i),
    R.assoc("plannedMove", R.prop(key, plannedMoves)),
    R.assoc("id", key)
  )(key)
);

const mapWithIndex = R.addIndex(R.map);
const toArray = ({ actors, plannedMoves, characterRoster }) => {
  return mapWithIndex(getCharacterFromState(actors, plannedMoves), characterRoster);
};

const calculatedHealth = ({maxHealth, wounds}) => deriveHealth(maxHealth, wounds)


const getTurnOrder = R.sortWith([
  R.ascend(calculatedHealth),
  R.descend(R.prop("speed")),
  R.ascend(R.prop("position")),
]);

const isPlannedMoveEmpty = (id) =>
  R.pipe(R.pathSatisfies(R.and(R.isEmpty, R.isNil), ["plannedMoves", id]));
const isAliveInState = (id) => R.pathSatisfies(R.equals('ALIVE'), ["actors", id, "status"]);
const isAlive = R.propSatisfies(R.equals('ALIVE'), "status");
const isUnplanned = R.propSatisfies(R.isNil, "plannedMove");

const playersFromStateLens = R.lens(toArray, R.identity);
const livingPlayers = R.lens(R.filter(isAlive), R.identity);
const availablePlayers = R.lens(R.filter(isUnplanned), R.identity);

export const livingPlayersFromStateLens = R.pipe(livingPlayers, playersFromStateLens);
export const availableLivingPlayers = R.compose(livingPlayersFromStateLens, availablePlayers);

export const getCurrentPlayer = R.pipe(getTurnOrder, R.head);
export const canPlanMove = (id, state) => {
  return R.allPass([isPlannedMoveEmpty(id), isAliveInState(id)])(state);
};
