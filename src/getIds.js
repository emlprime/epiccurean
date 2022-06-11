import * as R from 'ramda';

const getIds = (type) =>
  R.pipe(R.prop('actors'), R.filter(R.propEq('type', type)), R.keys);

export const getCharacterIds = getIds('CHARACTER');
export const getAIIds = getIds('AI');
