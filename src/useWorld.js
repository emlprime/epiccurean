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

export const useWorld = (db) => {
  const stateControl = useReducer(moveReducer, R.assoc('db', db, initialState));
  const [state, dispatch] = stateControl;

  return { stateControl };
};
