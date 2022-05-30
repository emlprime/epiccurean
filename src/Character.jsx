import React from 'react';
import * as R from 'ramda';
import ProgressBar from '@ramonak/react-progress-bar';
import { selectActionStatus } from './selectActionStatus';
import ActionStatus from './ActionStatus';
import { canPlanMove } from './actorSelectors';
import styled from 'styled-components';
import { GiBroadsword } from '@react-icons/all-files/gi/GiBroadsword';
import { GiTargeting } from '@react-icons/all-files/gi/GiTargeting';

export default function Character({
  id,
  color,
  state,
  dispatch,
  isCurrent,
  currentTic,
}) {
  const health = R.path(['actors', id, 'health'], state);
  const name = R.path(['actors', id, 'name'], state);
  const target = R.path(['actors', id, 'target'], state)
  const disableTarget = !canPlanMove(id, state) || !isCurrent;
  const disableAttack = !canPlanMove(id, state) || !isCurrent || R.isNil(target);
  return (
    <Style>
      <div>{name}</div>
      <ProgressBar bgColor={color} completed={health} />
      <button
        title="Leeerooooy Jenkins!!!"
        disabled={disableAttack}
        onClick={() =>
          dispatch({
            type: 'Attack',
            actor: id,
            target: target,
            amount: 10,
            currentTic,
          })
        }
      >
        <GiBroadsword />
      </button>
      <button
        title="Set Target"
        disabled={disableTarget}
        onClick={() =>
          dispatch({
            type: 'setTarget',
            actor: id
          })
        }
      >
        <GiTargeting />
      </button>
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
}
`;
