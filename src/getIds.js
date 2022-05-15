import * as R from 'ramda';

const getIds = (type) =>
  R.pipe(R.prop('characters'), R.filter(R.propEq('type', type)), R.keys);

export const getPlayerCharacterIds = getIds('Character');
export const getAICharacterIds = getIds('AI');
