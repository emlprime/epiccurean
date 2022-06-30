import React from 'react';
import * as R from 'ramda';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const config = {
  title: {
    text: 'Fight',
  },
  chart: { type: 'column' },
  plotOptions: {
    column: {
      stacking: 'normal',
    },
  },
};
const knownColors = { luck: 'lightgreen', skill: 'darkgreen', strength: 'purple', size: 'orange' };

const deriveStat = R.curry((actor, stat, results) => {
  return {
    name: `${actor} ${stat}`,
    data: [R.path([actor, stat], results)],
    stack: actor,
    color: R.prop(stat, knownColors),
  };
});

const attackerStats = ['luck', 'skill', 'strength'];
const defenderStats = ['luck', 'skill', 'size'];

const generateSeries = () => {
  const results = {
    attacker: { luck: 5, skill: 8, strength: 10 },
    defender: { luck: 3, skill: 5, size: 20},
  };
  const series = [
    ...R.map(deriveStat('attacker', R.__, results), attackerStats),
    ...R.map(deriveStat('defender', R.__, results), defenderStats),
  ];
  return series;
};

const options = R.assoc('series', generateSeries(), config);
console.log(options);

const Chart = () => (
  <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
);

export default Chart;
