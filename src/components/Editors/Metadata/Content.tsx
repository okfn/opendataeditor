import * as React from 'react'
import Package from '../Package2'
import Resource from '../Resource2'
import Dialect from '../Dialect2'
import Schema from '../Schema2'
import { useStore } from './store'

export default function Content() {
  const type = useStore((state) => state.editorState.type)
  switch (type) {
    case 'package':
      return <Package />
    case 'resource':
      return <Resource />
    case 'dialect':
      return <Dialect />
    case 'schema':
      return <Schema />
    default:
      return null
  }
}
