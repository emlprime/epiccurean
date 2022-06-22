import * as R from 'ramda';
import React from 'react';
import Gradient from 'javascript-color-gradient';

const statusColor = new Gradient()
  .setColorGradient('#006400', '#ff0000')
  .setMidpoint(6)
  .getColors();

const getFillByStatus = R.curry((statusColor, statuses, part) =>
  R.pipe(
    R.prop(R.__, statuses),
    R.clamp(0, 5),
    R.defaultTo(0),
    R.prop(R.__, statusColor)
  )(part)
);

const ActorStatus = ({ statuses }) => {
  const origin = 22;
  const limbWidth = 5;
  const armLength = 20;
  const legLength = 30;
  const body = 15;

  const getFill = getFillByStatus(statusColor, statuses);
  
  return (
    <svg viewBox="0 0 100 100">
      <g stroke="black" fill="none" strokeWidth="1">
        <circle cx="27" cy="10" r="8" fill={getFill('head')} />

        <path
          d={`M10,${origin} h${limbWidth} v${armLength} h-${limbWidth} Z`}
          fill={getFill('leftarm')}
        />
        <path
          d={`M40,${origin} h${limbWidth} v${armLength} h-${limbWidth} Z`}
          fill={getFill('rightarm')}
        />
        <path
          d={`M20,${origin + 20} h${limbWidth} v${legLength} h-${limbWidth} Z`}
          fill={getFill('leftleg')}
        />
        <path
          d={`M30,${origin + 20} h${limbWidth} v${legLength} h-${limbWidth} Z`}
          fill={getFill('rightleg')}
        />
        <path
          d={`M20,${origin} h${body} v${body} h-${body} Z`}
          fill={getFill('body')}
        />
      </g>
    </svg>
  );
};

export default ActorStatus;
