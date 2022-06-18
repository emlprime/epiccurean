import React from 'react';
import * as R from 'ramda';
import ProgressBar from '@ramonak/react-progress-bar';
import styled from 'styled-components';
import ActionStatus from './ActionStatus'
import {selectActionStatus} from './selectActionStatus'
import {deriveHealth} from './deriveThings'

export default function AI({ id, color, state, currentTic, children }) {
  const {name, maxHealth, wounds} = R.path(['actors', id], state)
  const health = deriveHealth(maxHealth, wounds);
  return (
    <Style>
      <div>{name}</div>
      <ProgressBar bgColor={color} completed={health} maxCompleted={maxHealth} />
      {children}
    </Style>    
  );
}

const Style = styled.div`
font-family: calibri;
margin: 1rem;
width: 150px;
text-align: center;
.health {
  border: 1px solid;
}
& div {
  display: flex;
  justify-content: flex-end;
}
`;
