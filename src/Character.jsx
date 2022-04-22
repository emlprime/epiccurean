import React from "react"
import * as R from "ramda"
import ProgressBar from "@ramonak/react-progress-bar";
import styled from "styled-components"

const isCurrentMoveEmpty = (id) => R.pipe(
  R.pathSatisfies(R.and(R.isEmpty,R.isNil), ['currentMove', id]),
  R.not
)

export default function Character({id, color, state, dispatch, currentTic}) {
  const health= R.path(["characters", id, 'health'], state)
  const name= R.path(["characters", id, 'name'], state)
  const disabled = R.or(isCurrentMoveEmpty(id)(state), R.equals(health, 0))
  return (
<Style>
        <div>{name}</div>
        <ProgressBar bgColor={color} completed={health} />
        <button disabled={disabled} onClick={() => dispatch({type: "Attack", target: "def456", amount: 100, currentTic})}>Attack</button>
    </Style>
  )
}

const Style = styled.div`
font-family: calibri;
margin: 1rem;
width: 150px;
text-align: center;
.health {
  border: 1px solid;
}
`