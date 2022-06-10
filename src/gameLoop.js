import * as R from 'ramda';
import { getAIIds, getCharacterIds } from './getIds';

const isAttack = R.propEq('type', 'Attack');
const isHeal = R.propEq('type', 'Heal');

const getByType = (typePred) => R.pipe(R.values, R.filter(typePred));
const getAttacks = getByType(isAttack);
const getHeals = getByType(isHeal);

const healthLens = (id) => R.lensPath(['actors', id, 'health']);
const handleHealthMutation =
  (mutation) =>
  (state, { target, amount }) => R.over(
      healthLens(target),
      R.pipe(mutation(R.__, amount), R.clamp(0, 100)),
      state
    );

const handleAttack = handleHealthMutation(R.subtract);
const handleHeal = handleHealthMutation(R.add);

const reduceAttack = (state) =>
  R.reduce(handleAttack, state, getAttacks(R.prop('effectiveMoves', state)));

const reduceHeal = (state) =>
  R.reduce(handleHeal, state, getHeals(R.prop('effectiveMoves', state)));

const reduceContext = R.pipe(reduceAttack, reduceHeal);

const addEffectiveMove = (ticMoves) =>
  R.over(R.lensProp('effectiveMoves'), R.concat(R.values(ticMoves)));

const clearEffectiveMoves = R.assoc('effectiveMoves', []);

const clearPlannedMoves = (ticMoves) =>
  R.over(R.lensProp('plannedMoves'), R.omit(R.keys(ticMoves)));

const isDead = R.propEq('health', 0);
const bringOutYourDead = R.pipe(R.prop('actors'), R.filter(isDead), R.keys);

const knownActions = {
  scratch: { type: 'Attack', amount: 4, planOffset: 2 },
  scrappin: { type: 'Attack', amount: 20, planOffset: 8 },
  stabby: { type: 'Attack', amount: 15, planOffset: 5 },
  lifegiver: { type: 'Heal', amount: 50, planOffset: 10 },
  quickie: { type: 'Heal', amount: 5, planOffset: 2}
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
  const { type, amount, planOffset } = R.prop(currentAction, knownActions);
  const plannedFor = planOffset + currentTic;
  return { type, amount, plannedFor };
};

const getAIAction = (state, currentTic, id) => {
  const target = firstLivingCharacter(state);
  const action = planAction(state, currentTic, id);
  return R.assoc('target', target, action);
};

const reduceAIMove = ({ state, currentTic }, id) => {
  const hasNoMove = R.pathSatisfies(R.isNil, ['plannedMoves', id]);
  const alive = R.pipe(bringOutYourDead, R.includes(id), R.not);
  const isReadyToMove = R.both(hasNoMove, alive)(state);
  const AIAction = getAIAction(state, currentTic, id);

  if (isReadyToMove) {
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
//}

const reduceMoves = R.curry((ticMoves, currentTic, state) =>
  R.pipe(
    addEffectiveMove(ticMoves),
    clearPlannedMoves(ticMoves),
    reduceContext,
    clearEffectiveMoves,
    disableDeadActors,
    planAIMoves(currentTic)
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

export default function moveReducer(state, action) {
  const { type } = action;
  switch (type) {
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
    default:
      return state;
  }
}
