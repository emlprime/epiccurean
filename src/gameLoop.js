import * as R from 'ramda';
import { getAIIds, getCharacterIds } from './getIds';
import { setActors, updateActor } from './mutations';
import { deriveHealth, deriveStatus } from './deriveThings';
import { calcAttack } from './calcAttack';

const isAttack = R.propEq('type', 'Attack');
const isHeal = R.propEq('type', 'Heal');

const getByType = (typePred) => R.pipe(R.values, R.filter(typePred));
const getAttacks = getByType(isAttack);
const getHeals = getByType(isHeal);

const woundsLens = (id) => R.lensPath(['actors', id, 'wounds']);
const actorLens = (id) => R.lensPath(['actors', id]);
const notifyLens = R.lensProp('notifications');

const handleAttack = (state, action) => {
  const { attackType, target, amount } = action;
  const currentWounds = R.path(['actors', target, 'wounds'], state);
  const maxHealth = R.path(['actors', target, 'maxHealth'], state);
  const targetOfTargetId = R.path(['actors', target, 'target'], state);
  const attack = R.mergeLeft({ targetOfTargetId }, action);
  const attackBundle = calcAttack(state, attack);
  const { notification, wound } = attackBundle;
  const wounds = R.isNil(wound)
    ? currentWounds
    : R.append(wound, currentWounds);
  const health = deriveHealth(maxHealth, wounds);
  const status = deriveStatus(health);
  const woundFunc = R.isNil(wound) ? R.identity : R.append(wound);
  const notify = R.isNil(notification) ? R.identity : R.append(notification);
  return R.pipe(
    R.over(woundsLens(target), R.pipe(R.defaultTo([]), woundFunc)),
    R.over(notifyLens, R.pipe(R.defaultTo([]), notify)),
    R.over(actorLens(target), R.assoc('status', status))
  )(state);
};

const handleHeal = (state, action) => {
  const { target } = action;
  const currentWounds = R.pathOr([], ['actors', target, 'wounds'], state);
  const byAmount = R.descend(R.prop('amount'));
  const woundSort = R.sort(byAmount, currentWounds);
  const wounds = R.drop(1, woundSort);
  return R.over(woundsLens(target), R.always(wounds), state);
};

const reduceAttack = (state) =>
  R.reduce(handleAttack, state, getAttacks(R.prop('effectiveMoves', state)));

const reduceHeal = (state) =>
  R.reduce(handleHeal, state, getHeals(R.prop('effectiveMoves', state)));

const reduceContext = R.pipe(reduceAttack, reduceHeal);
const reduceObject = (index, id, value) => {
  return {
    ...value[id],
    actorId: id,
  };
};
const arrayWithIdsFromObject = R.pipe(R.mapObjIndexed(reduceObject), R.values);
const addEffectiveMove = (ticMoves) =>
  R.over(
    R.lensProp('effectiveMoves'),
    R.concat(arrayWithIdsFromObject(ticMoves))
  );

const clearEffectiveMoves = R.assoc('effectiveMoves', []);

const clearPlannedMoves = (ticMoves) =>
  R.over(R.lensProp('plannedMoves'), R.omit(R.keys(ticMoves)));

const isDead = R.propEq('status', 'DEAD');
const bringOutYourDead = R.pipe(R.prop('actors'), R.filter(isDead), R.keys);

const knownActions = {
  scratched: { type: 'Attack', amount: 100, planOffset: 1 },
  scrapped: { type: 'Attack', amount: 100, planOffset: 1 },
  stabbed: { type: 'Attack', amount: 100, planOffset: 1 },
  lifegiver: { type: 'Heal', amount: 50, planOffset: 6 },
  quickie: { type: 'Heal', amount: 5, planOffset: 2 },
};

//TODO can be refactored
const firstLivingCharacter = (state) => {
  const { characterRoster } = state;
  const deadTargets = bringOutYourDead(state);
  const livingTargets = R.without(deadTargets, characterRoster);
  return livingTargets[0];
};

const planAction = (state, currentTic, id) => {
  const currentAction = R.path(['actors', id, 'currentAction'], state);
  const { type, amount, planOffset } = R.propOr(
    {},
    currentAction,
    knownActions
  );
  const plannedFor = planOffset + currentTic;
  return { attackType: currentAction, type, amount, plannedFor };
};

const getAIAction = (state, currentTic, id) => {
  const target = firstLivingCharacter(state);
  if (!target) return;
  const action = planAction(state, currentTic, id);
  return R.assoc('target', target, action);
};

const reduceAIMove = ({ state, currentTic }, id) => {
  const hasNoMove = R.pathSatisfies(R.isNil, ['plannedMoves', id]);
  const alive = R.pipe(bringOutYourDead, R.includes(id), R.not);
  const isReadyToMove = R.both(hasNoMove, alive)(state);
  const AIAction = getAIAction(state, currentTic, id);

  if (isReadyToMove && AIAction) {
    const currentState = R.assocPath(['plannedMoves', id], AIAction, state);
    return { state: currentState, currentTic };
  }
  return { state, currentTic };
};

const planAIMoves = R.curry((currentTic, state) => {
  //find all actors and filter for AI actors without a planned action

  //hard code attack for all actors above
  //add back to the state
  //return new state
  //don't do this if AI has 0 health
  const result = R.reduce(reduceAIMove, { state, currentTic }, getAIIds(state));
  return R.prop('state', result);
});

const disableDeadActors = (state) => {
  //filter for actor names where actor has 0 health
  //omit above actor move from current moves
  const deadActors = bringOutYourDead(state);
  return R.over(R.lensProp('plannedMoves'), R.omit(deadActors))(state);
};

const persistActors = (state) => {
  const actors = R.prop('actors', state);
  const db = R.prop('db', state);
  setActors(db, actors);
  return state;
};

const reduceMoves = R.curry((ticMoves, currentTic, state) =>
  R.pipe(
    addEffectiveMove(ticMoves),
    clearPlannedMoves(ticMoves),
    reduceContext,
    clearEffectiveMoves,
    disableDeadActors,
    planAIMoves(currentTic),
    persistActors,
  )(state)
);

// turn evaluates each tic for planned actions and executes them on time
function turn(state, action) {
  const { tic: currentTic } = action;
  const ticMoves = R.filter(
    R.propSatisfies((tic) => tic === currentTic, 'plannedFor'),
    R.prop('plannedMoves', state)
  );
  return reduceMoves(ticMoves, currentTic, state);
}

const setMove = (state, action) => {
  const { actor, currentAction } = action;
  return R.assocPath(['actors', actor, 'currentAction'], currentAction, state);
};

const setPlannedMove = (state, action) => {
  const { actor, currentTic } = action;
  const actionTemplate = planAction(state, currentTic, actor);
  const target = R.path(['actors', actor, 'target'], state);
  const plannedMove = R.assoc('target', target, actionTemplate);
  return R.assocPath(['plannedMoves', actor], plannedMove, state);
};

const setTarget = (state, action) => {
  const { target, actor } = action;
  return R.pipe(
    R.assocPath(['actors', actor, 'target'], target),
    R.dissocPath(['actors', actor, 'isTargeting'])
  )(state);
};

const beginTargeting = (state, action) => {
  const { actor } = action;
  return R.assocPath(['actors', actor, 'isTargeting'], true, state);
};

const updateActors = (state, action) => {
  const { actors } = action;
  const characterRoster = R.pipe(
    R.filter(R.propEq('type', 'CHARACTER')),
    R.keys
  )(actors);
  return R.pipe(
    R.assoc('actors', actors),
    R.assoc('characterRoster', characterRoster)
  )(state);
};

const clearNotification = (state, action) => {
  const notificationLens = R.lensProp('notifications');
  return R.over(notificationLens, R.drop(1), state);
};

export default function moveReducer(state, action) {
  const { type } = action;
  switch (type) {
    case 'UPDATE_ACTORS':
      return updateActors(state, action);
    case 'setPlannedMove':
      return setPlannedMove(state, action);
    case 'setMove':
      return setMove(state, action);
    case 'beginTargeting':
      return beginTargeting(state, action);
    case 'setTarget':
      return setTarget(state, action);
    //   case "Heal": return handleHeal(state, action)
    //  calls turn on a tic - action contains type and tic, state is updated each iteration
    case 'Take Turn':
      return turn(state, action);
    case 'Clear Notification':
      return clearNotification(state, action);

    default:
      return state;
  }
}
