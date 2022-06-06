import React from 'react';
import * as R from 'ramda';
import ProgressBar from '@ramonak/react-progress-bar';
import { selectActionStatus } from './selectActionStatus';
import ActionStatus from './ActionStatus';
import { canPlanMove } from './actorSelectors';
import styled from 'styled-components';
import { GiBroadsword } from '@react-icons/all-files/gi/GiBroadsword';
import { GiTargeting } from '@react-icons/all-files/gi/GiTargeting';
import { GiHealthPotion } from '@react-icons/all-files/gi/GiHealthPotion';
import { GiPlayButton } from '@react-icons/all-files/gi/GiPlayButton';

export default function Character({
  id,
  color,
  state,
  dispatch,
  isCurrent,
  currentTic,
  children
}) {
  const actor = R.path(['actors', id], state)
  const {health, name, target, isTargeting, currentAction} = actor
  const disableTarget = !canPlanMove(id, state) || !isCurrent || isTargeting;
  const disableAttack = disableTarget || R.isNil(target);
  const disableDone = disableAttack || R.isNil(currentAction)
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
            type: 'setMove',
            currentAction: 'stabby',
            actor: id,
            target: target,
            currentTic,
          })
        }
      >
        <GiBroadsword />
      </button>
      <button
        title="MEDIC!!!!"
        disabled={disableAttack}
        onClick={() =>
          dispatch({
            type: 'setMove',
            currentAction: 'lifegiver',
            actor: id,
            target: target,
            currentTic,
          })
        }
      >
        <GiHealthPotion />
      </button>
      <button
        title="done"
        disabled={disableDone}
        onClick={() =>
          dispatch({
            type: 'setPlannedMove',
            actor: id,
            currentTic,
          })
        }
      >
        <GiPlayButton />
      </button>
      {children}
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
