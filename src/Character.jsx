import React from 'react';
import * as R from 'ramda';
import ProgressBar from '@ramonak/react-progress-bar';
import { selectActionStatus } from './selectActionStatus'
import ActionStatus from './ActionStatus';
import styled from 'styled-components';
import { GiBroadsword } from '@react-icons/all-files/gi/GiBroadsword';

const isPlannedMoveEmpty = (id) =>
  R.pipe(
    R.pathSatisfies(R.and(R.isEmpty, R.isNil), ['plannedMove', id]),
  );
const isAlive = (id) => R.pathSatisfies(R.gt(R.__,0),['actors', id, "health"])
const canPlanMove = (id, state) => {
  return R.allPass([isPlannedMoveEmpty(id), isAlive(id)])(state);
}

export default function Character({ id, color, state, dispatch, isCurrent, currentTic }) {
  const health = R.path(['actors', id, 'health'], state);
  const name = R.path(['actors', id, 'name'], state);
  const disabled = !canPlanMove(id, state)
  console.log(isCurrent)
  return (
    <Style>
      <div>{name}</div>
      <ProgressBar bgColor={color} completed={health} />
      <button
        title="Leeerooooy Jenkins!!!"
        disabled={disabled}
        onClick={() =>
          dispatch({
            type: 'Attack',
            actor: id,
            target: 'def456',
            amount: 10,
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
