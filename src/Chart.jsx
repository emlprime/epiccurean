import React from 'react';
import * as R from 'ramda';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { calcHitMatrix } from './hitStats';

const config = {
  title: {
    text: 'Fight',
  },
  legend: { enabled: false },
  chart: { type: 'column' },
  plotOptions: {
    column: {
      stacking: 'normal',
    },
  },
};
const knownColors = {
  luck: 'lightgreen',
  reach: 'darkgreen',
  agility: 'purple',
  targeting: 'orange',
  visibility: 'yellow',
  cover: 'lightblue',
  elevation: 'brown',
};

const deriveStat = R.curry((actor, stat, results) => {
  return {
    name: `${actor} ${stat}`,
    data: [R.path([actor, stat], results)],
    stack: actor,
    color: R.prop(stat, knownColors),
  };
});
const attacker = {
  str: 50,
  dex: 10,
  mass: 20,
  height: 75,
  attention: 14,
  vision: 10,
  cover: 3,
  weapon: { length: 5, mass: 2000, complexity: 5, name: 'bo staff' },
  elevation: 20,
};
const defender = {
  speed: 5,
  dex: 10,
  mass: 10,
  height: 60,
  str: 20,
  attention: 3,
  vision: 10,
  cover: 3,
  weapon: { mass: 1000, flexibility: 15 },
  volume: 20,
  elevation: 10,
};
const attackerHitMatrix = calcHitMatrix(attacker);
const defenderHitMatrix = calcHitMatrix(defender);
const categories = [
  'reach',
  'agility',
  'targeting',
  'visibility',
  'cover',
  'elevation',
];

const attackerStats = R.applySpec(attackerHitMatrix)(15);
const defenderStats = R.applySpec(defenderHitMatrix)(44);

const formatSeries = R.curry((stack, name, [{ luck, skill } = {}, x]) => {
  return [
    {
      stack,
      name: `${stack} ${name} skill`,
      color: R.prop(name, knownColors),
      data: [
        {
          x,
          y: skill,
        },
      ],
    },
    {
      stack,
      name: `${stack} ${name} luck`,
      color: R.prop('luck', knownColors),
      data: [
        {
          x,
          y: luck,
        },
      ],
    },
  ];
});
const formatAttackerSeries = formatSeries('attacker');
const formatDefenderSeries = formatSeries('defender');
const mapWithIndex = R.addIndex(R.map);

const generateSeries = () => {
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

const options = R.pipe(
  R.assoc('series', generateSeries()),
  R.assocPath(['xAxis', 'categories'], categories)
)(config);
console.log(options);

const Chart = () => (
  <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
);

export default Chart;
