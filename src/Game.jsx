import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import REPL from './REPL';
import Fight from './Fight';

const Game = ({ db }) => {
  const [tab, setTab] = useState('REPL');
  return (
    <>
      <article>
        <button
          type="button"
          onClick={() => setTab('FIGHT')}
          disabled={R.equals('FIGHT', tab)}
        >
          Fight
        </button>
        <button
          type="button"
          onClick={() => setTab('REPL')}
          disabled={R.equals('REPL', tab)}
        >
          REPL
        </button>
      </article>
      {R.equals('FIGHT', tab) ? <Fight db={db} /> : <REPL />}
    </>
  );
};

export default Game;
