import React, { useReducer, useCallback, useEffect, useState } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import Profile from './Profile';
import Character from './Character';
import ActionStatus from './ActionStatus';
import AI from './AI';
import Loop from './Loop';
import moveReducer from './gameLoop';
import { selectActionStatus } from './selectActionStatus';
import { getCharacterIds, getAIIds } from './getIds';
import {
  livingPlayersFromStateLens,
  availableLivingPlayers,
  getCurrentPlayer,
} from './actorSelectors';
import { GiHumanTarget } from '@react-icons/all-files/gi/GiHumanTarget';
import { watchActors } from './getActors';
const initialState = {
  actors: {},
  characterRoster: [],
  plannedMoves: {},
  effectiveMoves: [],
};
import { resetActors } from './resetActors';

export default function Fight({ db }) {
  const [state, dispatch] = useReducer(
    moveReducer,
    R.assoc('db', db, initialState)
  );
  // this triggers the reducer case of "take turn"
  const onChangeActors = (actors) => {
    dispatch({ type: 'UPDATE_ACTORS', actors });
  };

  useEffect(() => watchActors(db, onChangeActors), []);

  const [currentTic, setCurrentTic] = useState(0);
  const players = R.view(availableLivingPlayers, state);
  const actors = R.prop('actors', state);
  const currentPlayer = getCurrentPlayer(players);
  const takeTurn = useCallback(
    (tic) => {
      dispatch({ type: 'Take Turn', tic });
      setCurrentTic(tic);
    },
    [dispatch]
  );

  const currentPlayerId = R.prop('id', currentPlayer);
  const needTarget = R.path(['actors', currentPlayerId, 'isTargeting'], state);
  return (
    <Style>
      <button onClick={() => resetActors(db)}>Reset Actors</button>
      <Loop callback={takeTurn} />
      <section>
        <Profile className="left">
          {R.map(
            (id) => (
              <Character
                key={id}
                id={id}
                isCurrent={R.equals(id, R.prop('id', currentPlayer))}
                color="blue"
                state={state}
                dispatch={dispatch}
                currentTic={currentTic}
              >
                {needTarget && (
                  <button
                    onClick={() =>
                      dispatch({
                        target: id,
                        actor: currentPlayerId,
                        type: 'setTarget',
                      })
                    }
                  >
                    <GiHumanTarget />
                  </button>
                )}
              </Character>
            ),
            getCharacterIds(state)
          )}
        </Profile>
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
                  <button
                    onClick={() =>
                      dispatch({
                        target: id,
                        actor: currentPlayerId,
                        type: 'setTarget',
                      })
                    }
                  >
                    <GiHumanTarget />
                  </button>
                )}
              </AI>
            ),
            getAIIds(state)
          )}
        </Profile>
      </section>
    </Style>
  );
}

const Style = styled.div`
  section {
    display: flex;
    justify-content: space-between;
  }
`;
