import React from "react"
import * as R from "ramda"

const didYouGetHit = R.T
const attacks = []

const REPL = () => {
  return <pre>{JSON.stringify(
    R.map(didYouGetHit, attacks),
    null, 2)}</pre>
}

export default REPL