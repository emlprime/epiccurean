import React from 'react';
import * as R from 'ramda';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { calcHitMatrix, calcDodgeMatrix } from '../hitStats';
import { hitCalcConfig, categories } from './constants';
import { attacker, defender } from './data';
import { generateSeries } from './generateSeries';

const attackerHitMatrix = calcHitMatrix(attacker);
const defenderDodgeMatrix = calcDodgeMatrix(defender);

const attackerStats = R.applySpec(attackerHitMatrix)(15);
const defenderStats = R.applySpec(defenderDodgeMatrix)(44);

const options = R.pipe(
  R.assoc('series', generateSeries(categories, attackerStats, defenderStats)),
  R.assocPath(['xAxis', 'categories'], categories)
)(hitCalcConfig);

export const Chart = () => (
  <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
);
