import * as R from 'ramda';

export const selectActionStatus = (actor, currentTic, state) => {
  const currentMove = R.path(['currentMove', actor], state);
  const name = R.path(['characters', actor, 'name'], state);
  const target = R.prop('target', currentMove);
  const targetName = R.path(['characters', target, 'name'], state);
  return {
    actor: name,
    type: R.prop('type', currentMove),
    target: targetName,
    amount: R.prop('amount', currentMove),
    remainingTics: R.prop('plannedFor', currentMove) - currentTic,
  };
};