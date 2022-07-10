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

const CurrentCharacter = ({
  currentActorId: actorId,
  state,
  dispatch,
  currentTic,
}) => {
  const {
    name,
    target: targetId,
    currentAction,
    wounds: actorWounds = [],
    isTargeting = false,
  } = R.path(['actors', actorId], state);
  const { name: targetName, wounds: targetWounds = [] } = R.pathOr(
    {},
    ['actors', targetId],
    state
  );
  const disableTarget = !canPlanMove(actorId, state) || isTargeting;
  const disableAttack = disableTarget || R.isNil(targetId);
  const disableDone = disableAttack || R.isNil(currentAction);
  const actorStatuses = deriveStatus(actorWounds);
  const targetStatuses = deriveStatus(targetWounds);
  return (
    <Style>
      <div id="actorname">{name} </div>
      <div id="actorstatus">
        <ActorStatus statuses={actorStatuses} />
      </div>
      <div id="buttons">
        <button
          title="Set Target"
          disabled={disableTarget}
          onClick={() =>
            dispatch({
              type: 'beginTargeting',
              actor: actorId,
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
              currentAction: 'stabbed',
              actor: actorId,
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
              actor: actorId,
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
              actor: actorId,
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

//<pre>{JSON.stringify(currentActorId, null, 2)}</pre>

const Style = style.section`
width: 100%;
height: 300px;
display: grid;
grid-template: 'actorname . targetname' 80px 'actorstatus buttons targetstatus' 1fr / 1fr 50px 1fr;
> div > svg {
  height: 150px;
}
#targetstatus{
  height: 100%;
  width: 100%;
  grid-area: targetstatus;

}
#actorstatus{
  height: 50%;
  width: 50%;
  grid-area: actorstatus;

}
#actorname{
  grid-area: actorname;
}
#targetname{
  grid-area: targetname;
}
#buttons{
  grid-area: buttons;

}
`;
