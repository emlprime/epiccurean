import React from 'react';

const ActorStatus = () => {
  const origin = 22
  const limbWidth = 5
  const armLength = 20
  const legLength = 30
  const body = 15

  return <svg viewBox="0 0 200 200">
  <g stroke="black" fill="none" strokeWidth="2">
    <circle cx="27" cy="10" r="8" />


    <path d={`M10,${origin} h${limbWidth} v${armLength} h-${limbWidth} Z`} />
    <path d={`M40,${origin} h${limbWidth} v${armLength} h-${limbWidth} Z`} />
    <path d={`M20,${origin+20} h${limbWidth} v${legLength} h-${limbWidth} Z`} />
    <path d={`M30,${origin+20} h${limbWidth} v${legLength} h-${limbWidth} Z`} />
    <path d={`M20,${origin} h${body} v${body} h-${body} Z`} />

    

  </g>
</svg>
}

export default ActorStatus