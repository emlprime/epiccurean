import * as R from 'ramda';

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

const getTurnOrder = R.sortWith([
  R.ascend(R.prop('health')),
  R.descend(R.prop('speed')),
  R.ascend(R.prop('position')),
]);

const isPlannedMoveEmpty = (id) =>
  R.pipe(R.pathSatisfies(R.and(R.isEmpty, R.isNil), ['plannedMoves', id]));
const isAlive = (id) =>
  R.pathSatisfies(R.gt(R.__, 0), ['actors', id, 'health']);

export const stateLens = R.lens(toArray, R.identity);
export const getCurrentPlayer = R.pipe(getTurnOrder, R.head);
export const canPlanMove = (id, state) => {
  return R.allPass([isPlannedMoveEmpty(id), isAlive(id)])(state);
};
