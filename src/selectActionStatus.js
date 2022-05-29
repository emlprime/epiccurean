import * as R from 'ramda';

export const selectActionStatus = (actor, currentTic, state) => {
  const plannedMoves = R.path(['plannedMoves', actor], state);
  const name = R.path(['actors', actor, 'name'], state);
  const target = R.prop('target', plannedMoves);
  const targetName = R.path(['actors', target, 'name'], state);
  return {
    actor: name,
    type: R.prop('type', plannedMoves),
    target: targetName,
    amount: R.prop('amount', plannedMoves),
    remainingTics: R.prop('plannedFor', plannedMoves) - currentTic,
  };
};