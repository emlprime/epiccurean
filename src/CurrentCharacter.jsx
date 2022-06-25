import React from 'react';
import * as R from 'ramda';
import ActorStatus from './ActorStatus';
import { canPlanMove } from './actorSelectors';
import { GiBroadsword } from '@react-icons/all-files/gi/GiBroadsword';
import { GiTargeting } from '@react-icons/all-files/gi/GiTargeting';
import { GiHealthPotion } from '@react-icons/all-files/gi/GiHealthPotion';
import { GiPlayButton } from '@react-icons/all-files/gi/GiPlayButton';
import style from 'styled-components';

const deriveStatus = R.pipe(
  R.groupBy(R.prop('location')),
  R.map(R.pipe(R.pluck(['amount']), R.sum))
);

const CurrentCharacter = ({ currentPlayer, state, dispatch, currentTic }) => {
  const name = R.prop('name', currentPlayer);
  const targetId = R.prop('target', currentPlayer);
  const targetName = R.path(['actors', targetId, 'name'], state);
  const id = R.prop('id', currentPlayer);
  const isTargeting = R.prop('isTargeting', currentPlayer);
  const disableTarget = !canPlanMove(id, state) || isTargeting;
  const currentAction = R.prop('currentAction', currentPlayer);
  const disableAttack = disableTarget || R.isNil(targetId);
  const disableDone = disableAttack || R.isNil(currentAction);
  const playerWounds = R.propOr([], 'wounds', currentPlayer);
  const targetWounds = R.pathOr([], ['actors', targetId, 'wounds'], state);
  const playerStatuses = deriveStatus(playerWounds);
  const targetStatuses = deriveStatus(targetWounds);
console.log(currentPlayer)
  return (
    <Style>
      <div id="playername">{name} </div>
      <div id="playerstatus">
        <ActorStatus statuses={playerStatuses} />
      </div>
      <div id="buttons">
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
      </div>
      {targetId && (
        <>
          <div id="targetname"> {targetName} </div>
          <div id="targetstatus">
            <ActorStatus statuses={targetStatuses} />
          </div>
        </>
      )}
    </Style>
  );
};

export default CurrentCharacter;

//<pre>{JSON.stringify(currentPlayer, null, 2)}</pre>

const Style = style.section`
width: 100%;
height: 300px;
display: grid;
grid-template: 'playername . targetname' 80px 'playerstatus buttons targetstatus' 1fr / 1fr 50px 1fr;
> div > svg {
  height: 150px;
}
#targetstatus{
  height: 100%;
  width: 100%;
  grid-area: targetstatus;

}
#playerstatus{
  height: 50%;
  width: 50%;
  grid-area: playerstatus;

}
#playername{
  grid-area: playername;
}
#targetname{
  grid-area: targetname;
}
#buttons{
  grid-area: buttons;

}
`;
