import * as R from "ramda"

export default function ActionStatus ({actor, type, target, amount, remainingTics}) {
  return R.isNil(type) ? "" :
  `${actor} will ${type} ${target} for ${amount} in ${remainingTics} tics`
}