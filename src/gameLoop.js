import * as R from "ramda"
import {getAIIds} from './getIds'

const isAttack = R.propEq('type', 'Attack')
const isDefend = R.propEq('type', 'Defend')

const getByType = typePred => R.pipe(R.values, R.filter(typePred)) 
const getAttacks = getByType(isAttack)
const getDefends = getByType(isDefend)

function handleAttack(state, action) {
  const {target, amount}=action
  const current=R.path(["actors",target, 'health'], state)
  return R.assocPath(["actors", target, 'health'], R.clamp(0, 100, current - amount), state)
}

function reduceContext(state) {
  return R.reduce(handleAttack, state, getAttacks(R.prop("effectiveMoves", state)))
}

const addEffectiveMove = (ticMoves) =>   R.over(R.lensProp('effectiveMoves'), R.concat(R.values(ticMoves)))

const clearEffectiveMoves = R.assoc('effectiveMoves', [])

const clearPlannedMoves = (ticMoves) => R.over(R.lensProp('plannedMoves'), R.omit(R.keys(ticMoves)))

const isDead = R.propEq('health', 0)
const bringOutYourDead = R.pipe(
  R.prop('actors'),
  R.filter(isDead),
  R.keys
)

const reduceAIMove = ({state, currentTic}, id) => {
  const hasNoMove = R.pathSatisfies(R.isNil, ["plannedMoves", id])
  const alive = R.pipe(
    bringOutYourDead,
    R.includes(id),
    R.not
  )
  const isReadyToMove = R.both(hasNoMove, alive)(state)

  if (isReadyToMove) {
    const currentState = R.assocPath(["plannedMoves", id], {type: "Attack", target: "abc123", amount: 5, plannedFor: 3+currentTic}, state)
    return {state: currentState, currentTic}

  }
  return {state, currentTic}
}


const planAIMoves = R.curry((currentTic, state) => {
  //find all actors and filter for AI actors without a planned action

  //hard code attack for all actors above
  //add back to the state
  //return new state
  //don't do this if AI has 0 health

  const result =  R.reduce(reduceAIMove, {state, currentTic}, getAIIds(state))
  return R.prop('state', result)
  
  
})



const disableDeadActors = (state) => {
//filter for actor names where actor has 0 health
//omit above actor move from current moves
const deadActors = bringOutYourDead(state)
return R.over(R.lensProp('plannedMoves'), R.omit(deadActors))(state)
}
//}


const reduceMoves = R.curry((ticMoves, currentTic, state) => R.pipe(
  addEffectiveMove(ticMoves),
  clearPlannedMoves(ticMoves),
  reduceContext,
  clearEffectiveMoves,
  disableDeadActors,
  planAIMoves(currentTic),
)(state))

// turn evaluates each tic for planned actions and executes them on time
function turn(state, action) {
  const {tic: currentTic} = action
  const ticMoves = R.filter(R.propSatisfies(tic => tic === currentTic, "plannedFor"), R.prop("plannedMoves",state))
  return reduceMoves(ticMoves, currentTic, state)
}

const setMove = (state, action) => {
  const {target, actor, amount, currentTic}=action
  return R.assocPath(["plannedMoves", actor], {type: "Attack", target, amount, plannedFor: currentTic+5}, state)
}

const setTarget = (state, action) => {
  const {actor} = action
  return R.assocPath(['actors', actor, 'target'], 'rst654')(state)
}

export default function moveReducer (state, action) {
  const {type} = action
  switch(type) {
  case "Attack": return setMove(state, action)
  case "setTarget": return setTarget(state, action)
 //   case "Heal": return handleHeal(state, action)
 //  calls turn on a tic - action contains type and tic, state is updated each iteration
    case "Take Turn": return turn(state, action)
   default: return state
 }
 }