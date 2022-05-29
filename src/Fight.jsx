import React, { useReducer, useCallback, useState } from 'react';
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
import { livingPlayersFromStateLens, availablePlayers, getCurrentPlayer } from './actorSelectors'

const initialState = {
  actors: {
    abc123: { name: 'Bob', health: 100, speed: 15, type: 'Character' },
    def456: { name: 'Frank', health: 100, speed: 10, type: 'AI' },
    ghi789: { name: 'Doggo', health: 100, speed: 20, type: 'Character' },
    xyz987: { name: 'Jojo', health: 100, speed: 10, type: 'Character' },
    rst654: { name: 'Eeeeevil', health: 100, speed: 10, type: 'AI' },
    abc567: { name: 'Randy', health: 100, speed: 10, type: 'AI' },
  },
  characterRoster: ['abc123','ghi789','xyz987'],
  plannedMoves: {},
  effectiveMoves: [],
};

export default function Fight() {
  const [state, dispatch] = useReducer(moveReducer, initialState);
  // this triggers the reducer case of "take turn"
  const [currentTic, setCurrentTic] = useState(0);
  const players = R.view(availablePlayers, state);
  const currentPlayer = getCurrentPlayer(players)
  const takeTurn = useCallback(
    (tic) => {
      dispatch({ type: 'Take Turn', tic });
      setCurrentTic(tic);
    },
    [dispatch]
  );
  const needTarget = true
  return (
    <Style>
      <Loop callback={takeTurn} />
      <section>
        <Profile className="left">
          {R.map(
            (id) => (
              <Character
                key={id}
                id={id}
                isCurrent={R.equals(id, R.prop('id',currentPlayer))}
                color="blue"
                state={state}
                dispatch={dispatch}
                currentTic={currentTic}
              />
            ),
            getCharacterIds(initialState)
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
                currentTic={currentTic}>
                  {needTarget && <button>target</button>}
              </AI>
            ),
            getAIIds(initialState)
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
