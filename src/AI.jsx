import React from 'react';
import * as R from 'ramda';
import ProgressBar from '@ramonak/react-progress-bar';
import styled from 'styled-components';
import ActionStatus from './ActionStatus'
import {selectActionStatus} from './selectActionStatus'

export default function AI({ id, color, state, currentTic }) {
  const health = R.path(['characters', id, 'health'], state);
  const name = R.path(['characters', id, 'name'], state);

  return (
    <Style>
      <div>{name}</div>
      <ProgressBar bgColor={color} completed={health} />
      <ActionStatus {...selectActionStatus(id, currentTic, state)} />
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
