import * as React from 'react'
import Package from '../../Editors/Package'
import { useStore } from './store'

export default function Content() {
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  if (!modified) return null
  return (
    <Package
      package={modified}
      onChange={(descriptor) => updateState({ modified: descriptor })}
    />
  )
}
