import * as React from 'react'
import Package from '../Package2'
import Resource from '../Resource2'
import Dialect from '../Dialect2'
import Schema from '../Schema2'
import { useStore } from './store'

export default function Content() {
  const path = useStore((state) => state.editorState.path)
  switch (path) {
    case 'metadata/package':
      return <Package />
    case 'metadata/resource':
      return <Resource />
    case 'metadata/dialect':
      return <Dialect />
    case 'metadata/schema':
      return <Schema />
    default:
      return null
  }
}
