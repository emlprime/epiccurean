import React, { useState, useCallback } from 'react';
import useInterval from 'use-interval';
import { GiTimeBomb } from '@react-icons/all-files/gi/GiTimeBomb';

const Loop = ({ callback }) => {
  let [count, setCount] = useState(0);
  //  useInterval(() => {
  //    setCount(count +1)
  //    callback(count +1)
  //  }, (100*scale))

  const incrementTic = useCallback(() => {
    setCount(count + 1);
    callback(count + 1);
  }, [setCount, count, callback]);

  return (
    <>
      <label>Current Tick: {count}</label>
      <button
        type="button"
        onClick={() => {
          incrementTic();
        }}
      >
        <GiTimeBomb />
      </button>
    </>
  );
};

export default Loop;
