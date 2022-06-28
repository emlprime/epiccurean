import React from 'react';
import * as R from 'ramda';
import ProgressBar from '@ramonak/react-progress-bar';
import { selectActionStatus } from './selectActionStatus';
import ActionStatus from './ActionStatus';
import { canPlanMove } from './actorSelectors';
import { deriveHealth } from './deriveThings';
import styled from 'styled-components';

export default function Character({
  id,
  color,
  state,
  dispatch,
  isCurrent,
  currentTic,
  children,
}) {
  const actor = R.path(['actors', id], state);
  const plannedFor = R.path(['plannedMoves', id, 'plannedFor'], state)
  const plannedAt = R.path(['plannedMoves', id, 'plannedAt'], state)
  const {
    wounds = [],
    maxHealth,
    name,
    target,
    isTargeting,
    currentAction,
  } = actor;
  const health = deriveHealth(maxHealth, wounds);
  return (
    <Style>
      <div>{name}</div>
      <ProgressBar
        bgColor={color}
        completed={health}
        maxCompleted={maxHealth}
      />
      <ProgressBar
      completed={R.toString(plannedFor-currentTic)}
      maxCompleted={plannedFor-plannedAt}
      customLabel = " "
      />
      <div>{currentAction}</div>
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
}
`;
