export const categories = [
  'reach',
  'agility',
  'targeting',
  'visibility',
  'cover',
  'elevation',
];

export const hitCalcConfig = {
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
export const knownColors = {
  luck: 'lightgreen',
  reach: 'darkgreen',
  agility: 'purple',
  targeting: 'orange',
  visibility: 'yellow',
  cover: 'lightblue',
  elevation: 'brown',
};
