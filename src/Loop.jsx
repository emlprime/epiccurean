import React, {useState, useCallback} from "react"
import useInterval from "use-interval"

const Loop = ({callback}) => {
  let [count, setCount] = useState(0)
  const [scale, setScale] = useState(50)
//  useInterval(() => {
//    setCount(count +1)
//    callback(count +1)
//  }, (100*scale))

const incrementTic = useCallback(() => {
  setCount(count+1)
  callback(count+1)
}, [setCount, count, callback])


  return (
    <>
    <button type="button" onClick={() => {setScale(50)}}>slow</button>
    <button type="button" onClick={() => {setScale(10)}}>regular</button>
    <button type="button" onClick={() => {setScale(1)}}>fast</button>
    <h1>{count}</h1>
    <button type="button" onClick={() => {incrementTic()}}>tic tic boom</button>
    </>)
}

export default Loop