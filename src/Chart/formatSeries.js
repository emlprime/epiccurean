import * as R from 'ramda';
import { knownColors } from './constants';

export const formatSeries = R.curry(
  (stack, attr, [{ luck, skill, name } = {}, x]) => {
    return [
      {
        stack,
        name: `${stack} ${name}`,
        color: R.prop(attr, knownColors),
        data: [
          {
            x,
            y: skill,
          },
        ],
      },
      {
        stack,
        name: `${stack} luck`,
        color: R.prop('luck', knownColors),
        data: [
          {
            x,
            y: luck,
          },
        ],
      },
    ];
  }
);
