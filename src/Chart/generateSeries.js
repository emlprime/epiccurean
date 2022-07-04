import * as R from 'ramda';
import { formatSeries } from './formatSeries';

const mapWithIndex = R.addIndex(R.map);

const formatAttackerSeries = formatSeries('attacker');
const formatDefenderSeries = formatSeries('defender');

export const generateSeries = (categories, attackerStats, defenderStats) => {
  const series = [
    ...R.unnest(
      mapWithIndex(
        (category, index) =>
          formatAttackerSeries(category, [
            R.prop(category, attackerStats),
            index,
          ]),
        categories
      )
    ),
    ...R.unnest(
      mapWithIndex(
        (category, index) =>
          formatDefenderSeries(category, [
            R.prop(category, defenderStats),
            index,
          ]),
        categories
      )
    ),
  ];

  return series;
};
