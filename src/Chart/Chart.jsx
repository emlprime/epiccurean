import React from 'react';
import * as R from 'ramda';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { hitCalcConfig, categories } from './constants';
import { calcHitMatrix, calcDodgeMatrix } from '../hitStats';
import { attacker, defender } from './data';
import { generateSeries } from './generateSeries';

const attackerStats = R.pipe(calcHitMatrix, R.applySpec)(attacker)(15);
const defenderStats = R.pipe(calcDodgeMatrix, R.applySpec)(defender)(44);

const calcOptions = (categories, attackerStats, defenderStats) =>
  R.pipe(
    R.assoc('series', generateSeries(categories, attackerStats, defenderStats)),
    R.assocPath(['xAxis', 'categories'], categories)
  )(hitCalcConfig);

export const Chart = ({ categories, attackerStats, defenderStats }) => (
  <div>
    <HighchartsReact
      highcharts={Highcharts}
      options={calcOptions(categories, attackerStats, defenderStats)}
    />
  </div>
);
