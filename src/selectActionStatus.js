import * as R from 'ramda';

export const selectActionStatus = (actor, currentTic, state) => {
  const plannedMove = R.path(['plannedMove', actor], state);
  const name = R.path(['actors', actor, 'name'], state);
  const target = R.prop('target', plannedMove);
  const targetName = R.path(['actors', target, 'name'], state);
  return {
    actor: name,
    type: R.prop('type', plannedMove),
    target: targetName,
    amount: R.prop('amount', plannedMove),
    remainingTics: R.prop('plannedFor', plannedMove) - currentTic,
  };
};