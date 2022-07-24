import * as R from 'ramda';
import { useReducer } from 'react';
import moveReducer from './gameLoop';

const initialState = {
  actors: {},
  characterRoster: [],
  plannedMoves: {},
  effectiveMoves: [],
  notifications: [],
};

export const useWorld = (db, tic) => {
  const stateControl = useReducer(moveReducer, R.assoc('db', db, initialState));
  const [state, dispatch] = stateControl;

  const setTarget = R.curry((actorId, targetId) =>
    dispatch({
      target: targetId,
      actor: actorId,
      type: 'setTarget',
    })
  );

  const nextTurn = () => dispatch({ type: 'Take Turn', tic });

  return { stateControl, setTarget, nextTurn };
};
