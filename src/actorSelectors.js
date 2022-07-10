import * as R from 'ramda';
import { deriveHealth } from './deriveThings';

const getCharacterFromState = R.curry((actors, plannedMoves, key, i) =>
  R.pipe(
    R.prop(R.__, actors),
    R.assoc('position', i),
    R.assoc('plannedMove', R.prop(key, plannedMoves)),
    R.assoc('id', key)
  )(key)
);

const mapWithIndex = R.addIndex(R.map);
const toArray = ({ actors, plannedMoves, characterRoster }) => {
  return mapWithIndex(
    getCharacterFromState(actors, plannedMoves),
    characterRoster
  );
};

const calculatedHealth = ({ maxHealth, wounds }) =>
  deriveHealth(maxHealth, wounds);

const getTurnOrder = R.sortWith([
  R.ascend(calculatedHealth),
  R.descend(R.prop('speed')),
  R.ascend(R.prop('position')),
]);

const isPlannedMoveEmpty = (id) =>
  R.pipe(R.pathSatisfies(R.and(R.isEmpty, R.isNil), ['plannedMoves', id]));
const isAliveInState = (id) =>
  R.pathSatisfies(R.equals('ALIVE'), ['actors', id, 'status']);
const isAlive = R.propSatisfies(R.equals('ALIVE'), 'status');
const isUnplanned = R.propSatisfies(R.isNil, 'plannedMove');
const isPlayerCharacter = R.propEq('type', 'CHARACTER');

const actorsFromStateLens = R.lens(toArray, R.identity);
const livingLens = R.lens(R.filter(isAlive), R.identity);
const playerCharactersLens = R.lens(R.filter(isPlayerCharacter), R.identity);
const availableActors = R.lens(R.filter(isUnplanned), R.identity);

const asArray = (state) =>
  R.map((id) => ({ id, ...R.prop(id, state) }), R.keys(state));

const allActorsFromStateLens = R.lens(
  R.pipe(R.propOr({}, 'actors'), asArray),
  R.identity
);

const idsLens = R.lens(R.pluck('id'), R.identity);
export const actorsIdsFromStateLens = R.compose(
  allActorsFromStateLens,
  playerCharactersLens,
  livingLens,
  idsLens
);

export const livingActorsFromStateLens = R.pipe(
  livingLens,
  actorsFromStateLens
);

export const livingActorIdsFromStateLens = R.pipe(
  livingActorsFromStateLens,
  idsLens
);
export const availableLivingActors = R.compose(
  livingActorsFromStateLens,
  availableActors
);

export const getCurrentActor = R.pipe(getTurnOrder, R.head);
export const canPlanMove = (id, state) => {
  return R.allPass([isPlannedMoveEmpty(id), isAliveInState(id)])(state);
};
