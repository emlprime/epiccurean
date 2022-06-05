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
  const actor = R.path(['actors', id], state)
  const {health, name, target, isTargeting} = actor
  const disableTarget = !canPlanMove(id, state) || !isCurrent || isTargeting;
  const disableAttack = disableTarget || R.isNil(target);
  return (
    <Style>
      <div>{name}</div>
      <ProgressBar bgColor={color} completed={health} />
      <button
        title="Set Target"
        disabled={disableTarget}
        onClick={() =>
          dispatch({
            type: 'beginTargeting',
            actor: id
          })
        }
      >
        <GiTargeting />
      </button>
      <button
        title="Leeerooooy Jenkins!!!"
        disabled={disableAttack}
        onClick={() =>
          dispatch({
            type: 'Attack',
            actor: id,
            target: target,
            currentTic,
          })
        }
      >
        <GiBroadsword />
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
