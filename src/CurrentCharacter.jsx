import React from 'react';
import * as R from 'ramda';
import { canPlanMove } from './actorSelectors';
import { GiBroadsword } from '@react-icons/all-files/gi/GiBroadsword';
import { GiTargeting } from '@react-icons/all-files/gi/GiTargeting';
import { GiHealthPotion } from '@react-icons/all-files/gi/GiHealthPotion';
import { GiPlayButton } from '@react-icons/all-files/gi/GiPlayButton';


const CurrentCharacter = ({currentPlayer, state, dispatch, currentTic}) => {
const name = R.prop('name', currentPlayer)
const targetId = R.prop('target', currentPlayer)
const targetName = R.path(['actors', targetId, 'name'], state)
const id = R.prop('id', currentPlayer)
const isTargeting = R.prop('isTargeting', currentPlayer)
const disableTarget = !canPlanMove(id, state) || isTargeting;
const currentAction = R.prop('currentAction', currentPlayer)
const disableAttack = disableTarget || R.isNil(targetId);
const disableDone = disableAttack || R.isNil(currentAction);

  return (
  <div>
    <div>{name} </div>
    <button
        title="Set Target"
        disabled={disableTarget}
        onClick={() =>
          dispatch({
            type: 'beginTargeting',
            actor: id,
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
            target: targetId,
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
            target: targetId,
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
    <pre>{JSON.stringify(currentPlayer, null, 2)}</pre>
    <div> {targetName} </div>
    </div>)
}

export default CurrentCharacter