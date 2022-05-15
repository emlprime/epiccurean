import * as R from "ramda"
import {getAICharacterIds} from './getIds'

const isAttack = R.propEq('type', 'Attack')
const isDefend = R.propEq('type', 'Defend')

const getByType = typePred => R.pipe(R.values, R.filter(typePred)) 
const getAttacks = getByType(isAttack)
const getDefends = getByType(isDefend)

function handleAttack(state, action) {
  const {target, amount}=action
  const current=R.path(["characters",target, 'health'], state)
  return R.assocPath(["characters", target, 'health'], R.clamp(0, 100, current - amount), state)
}

function reduceContext(state) {
  return R.reduce(handleAttack, state, getAttacks(R.prop("effectiveMoves", state)))
}

const addEffectiveMove = (ticMoves) =>   R.over(R.lensProp('effectiveMoves'), R.concat(R.values(ticMoves)))

const clearEffectiveMoves = R.assoc('effectiveMoves', [])

const clearCurrentMove = (ticMoves) => R.over(R.lensProp('currentMove'), R.omit(R.keys(ticMoves)))

const isDead = R.propEq('health', 0)
const bringOutYourDead = R.pipe(
  R.prop('characters'),
  R.filter(isDead),
  R.keys
)

const reduceAIMove = ({state, currentTic}, id) => {
  const hasNoMove = R.pathSatisfies(R.isNil, ["currentMove", id])
  const alive = R.pipe(
    bringOutYourDead,
    R.includes(id),
    R.not
  )
  const isReadyToMove = R.both(hasNoMove, alive)(state)

  if (isReadyToMove) {
    const currentState = R.assocPath(["currentMove", id], {type: "Attack", target: "abc123", amount: 5, plannedFor: 3+currentTic}, state)
    return {state: currentState, currentTic}

  }
  return {state, currentTic}
}


const planAIMoves = R.curry((currentTic, state) => {
  //find all characters and filter for AI characters without a planned action

  //hard code attack for all characters above
  //add back to the state
  //return new state
  //don't do this if AI has 0 health

  const result =  R.reduce(reduceAIMove, {state, currentTic}, getAICharacterIds(state))
  return R.prop('state', result)
  
  
})



const disableDeadCharacters = (state) => {
//filter for character names where character has 0 health
//omit above character move from current moves
const deadCharacters = bringOutYourDead(state)
return R.over(R.lensProp('currentMove'), R.omit(deadCharacters))(state)
}
//}


const reduceMoves = R.curry((ticMoves, currentTic, state) => R.pipe(
  addEffectiveMove(ticMoves),
  clearCurrentMove(ticMoves),
  reduceContext,
  clearEffectiveMoves,
  disableDeadCharacters,
  planAIMoves(currentTic),
)(state))

// turn evaluates each tic for planned actions and executes them on time
function turn(state, action) {
  const {tic: currentTic} = action
  const ticMoves = R.filter(R.propSatisfies(tic => tic === currentTic, "plannedFor"), R.prop("currentMove",state))
  return reduceMoves(ticMoves, currentTic, state)
}

const setMove = (state, action) => {
  const {target, actor, amount, currentTic}=action
  return R.assocPath(["currentMove", actor], {type: "Attack", target, amount, plannedFor: currentTic+5}, state)
}

export default function moveReducer (state, action) {
  const {type} = action
  switch(type) {
  case "Attack": return setMove(state, action)
 //   case "Heal": return handleHeal(state, action)
 //  calls turn on a tic - action contains type and tic, state is updated each iteration
    case "Take Turn": return turn(state, action)
   default: return state
 }
 }