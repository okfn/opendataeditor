import * as React from 'react'
import Columns from '../../Parts/Columns'
import Target from './Target'
import Source from './Source'

export default function Editor() {
  return (
    <Columns height="100%">
      <Source />
      <Target />
    </Columns>
  )
}
