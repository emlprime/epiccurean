import React, {useReducer, useCallback, useState} from "react"
import * as R from "ramda"
import styled from "styled-components"
import Profile from "./Profile"
import Character from "./Character"
import AI from "./AI"
import ActionStatus from "./ActionStatus"
import Loop from "./Loop"
import moveReducer from "./gameLoop"

const initialState = {
  characters: {
    abc123: {name: "Bob", health: 100},
    def456: {name: "Chard", health: 100}
  },
  currentMove: {}, 
  effectiveMoves: []
}

const selectActionStatus = (actor, currentTic, state) => {
  const currentMove = R.path(["currentMove", actor], state)
  const name = R.path(["characters", actor, "name"], state)
  const target = R.prop("target",currentMove)
  const targetName = R.path(["characters", target, "name"], state)
  return {
    actor: name,
    type: R.prop("type", currentMove),
    target: targetName,
    amount: R.prop("amount", currentMove),
    remainingTics: R.prop("plannedFor", currentMove)-currentTic,
  }
}




export default function Fight() {
  const [state, dispatch] = useReducer(moveReducer, initialState)
  // this triggers the reducer case of "take turn"
  const [currentTic, setCurrentTic] = useState(0)
  const takeTurn = useCallback((tic) => {
    dispatch({type: "Take Turn", tic})
    setCurrentTic(tic)
  }, [dispatch])
  return (
  <Style>
  <Loop callback={takeTurn}/>   
  <section>  
  <Profile className="left">
    <Character id="abc123" color='blue' state={state} dispatch={dispatch} currentTic = {currentTic} /> 
    <ActionStatus {...selectActionStatus("abc123", currentTic, state)}/>
  </Profile>
  <Profile className="right">
    <AI id="def456" color='red' state={state} />
  <ActionStatus {...selectActionStatus("def456", currentTic, state)}/> 
  </Profile>
  </section>
</Style>
  )
}


const Style = styled.div`
section {
display: flex;
justify-content: space-between;
}


`