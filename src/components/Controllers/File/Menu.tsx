import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <MenuBar
      items={['metadata']}
      selected={panel === 'metadata' ? ['metadata'] : undefined}
      onMetadata={() =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
      }
    />
  )
}
