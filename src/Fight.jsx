import React, { useReducer, useCallback, useEffect, useState } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import Profile from './Profile';
import Character from './Character';
import CurrentCharacter from './CurrentCharacter';
import ActionStatus from './ActionStatus';
import AI from './AI';
import Loop from './Loop';
import moveReducer from './gameLoop';
import { selectActionStatus } from './selectActionStatus';
import { getCharacterIds, getAIIds } from './getIds';
import { actorsIdsFromStateLens } from './actorSelectors';
import { GiHumanTarget } from '@react-icons/all-files/gi/GiHumanTarget';
import { watchActors } from './getActors';
import { resetActors } from './resetActors';
import useInterval from 'use-interval';
import { useWorld } from './useWorld';

export default function Fight({ db }) {
  const [currentTic, setCurrentTic] = useState(0);
  const { stateControl, setTarget, nextTurn } = useWorld(db, currentTic);
  const [state, dispatch] = stateControl;
  // this triggers the reducer case of "take turn"
  const onChangeActors = (actors) => {
    dispatch({ type: 'UPDATE_ACTORS', actors });
  };

  const actorIds = R.view(actorsIdsFromStateLens, state);

  const [currentActorId, setCurrentActorId] = useState();

  useEffect(() => watchActors(db, onChangeActors), []);

  const takeTurn = useCallback(
    (tic) => {
      nextTurn();
      setCurrentTic(tic);
    },
    [dispatch]
  );
  const needTarget = R.path(['actors', currentActorId, 'isTargeting'], state);
  const notification = R.head(R.prop('notifications', state));
  useInterval(() => {
    if (notification) {
      dispatch({ type: 'Clear Notification' });
    }
  }, 2000);

  return (
    <Style>
      <header>
        <Loop callback={takeTurn} />
        <button onClick={() => resetActors(db)}>Reset Actors</button>
      </header>
      <section>
        <Profile className="left">
          {R.map(
            (id) => (
              <Character
                key={id}
                id={id}
                isCurrent={R.equals(id, currentActorId)}
                setCurrentActorId={setCurrentActorId}
                color="blue"
                state={state}
                currentTic={currentTic}
              >
                {needTarget && (
                  <button onClick={() => setTarget(currentActorId, id)}>
                    <GiHumanTarget />
                  </button>
                )}
              </Character>
            ),
            getCharacterIds(state)
          )}
        </Profile>
        <div>{notification}</div>
        <Profile className="right">
          {R.map(
            (id) => (
              <AI
                key={id}
                id={id}
                color="red"
                state={state}
                currentTic={currentTic}
              >
                {needTarget && (
                  <button onClick={() => setTarget(currentActorId, id)}>
                    <GiHumanTarget />
                  </button>
                )}
              </AI>
            ),
            getAIIds(state)
          )}
        </Profile>
      </section>
      {currentActorId && (
        <CurrentCharacter
          currentActorId={currentActorId}
          state={state}
          dispatch={dispatch}
          currentTic={currentTic}
        />
      )}
    </Style>
  );
}

const Style = styled.div`
  section {
    display: flex;
    justify-content: space-between;
  }
  header {
    display: flex;
  }
`;
