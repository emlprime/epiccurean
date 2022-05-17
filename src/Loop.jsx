import React, { useState, useCallback } from 'react';
import useInterval from 'use-interval';
import { GiTimeBomb } from '@react-icons/all-files/gi/GiTimeBomb';
import { GiTurtle } from '@react-icons/all-files/gi/GiTurtle';
import { GiRabbit } from '@react-icons/all-files/gi/GiRabbit';
import { GiLightningBranches } from '@react-icons/all-files/gi/GiLightningBranches';

const Loop = ({ callback }) => {
  let [count, setCount] = useState(0);
  const [scale, setScale] = useState(50);
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
      <button
        type="button"
        onClick={() => {
          setScale(50);
        }}
      >
        <GiTurtle />
      </button>
      <button
        type="button"
        onClick={() => {
          setScale(10);
        }}
      >
        <GiRabbit />
      </button>
      <button
        type="button"
        onClick={() => {
          setScale(1);
        }}
      >
        <GiLightningBranches />
      </button>
      <h1>{count}</h1>
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
